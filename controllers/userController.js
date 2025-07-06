const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { getUser } = require("../services/authService");
const generateOTP = require("../helpers/otpGenerator");
const { sendEmail } = require("../services/emailService");

const handleUserSignUp = async (req, res) => {
  let { fullname, email, password } = req.body;
  email = email?.toLowerCase();

  if (!fullname || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists.",
      });
    }

    const hashPass = await bcrypt.hash(password, 10);
    const user = await User.create({ fullname, email, password: hashPass });

    return res.status(201).json({
      success: true,
      message: "Signup successful.",
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while signing up.",
    });
  }
};

const handleUserSignIn = async (req, res) => {
  let { email, password } = req.body;
  email = email?.toLowerCase();

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Signin successful.",
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while signing in.",
    });
  }
};

const handleResetPasswordOtpRequest = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: true,
        message: "If an account with that email exists, an OTP has been sent.",
      });
    }

    const otp = generateOTP();
    const expiryTime = new Date(Date.now() + 10 * 60 * 1000);

    user.resetPasswordToken = otp;
    user.resetPasswordExpires = expiryTime;
    await user.save();

    const emailSubject = "Your Reset Password OTP";
    const emailHtml = `
            <p>You have requested a reset password for your account.</p>
            <p>Your One-Time Password (OTP) is: <strong>${otp}</strong></p>
            <p>This OTP is valid for 10 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
        `;
    const emailText = `Your One-Time Password (OTP) for reset password is: ${otp}. This OTP is valid for 10 minutes. If you did not request this, please ignore this email.`;

    await sendEmail(user.email, emailSubject, emailHtml, emailText);

    return res.status(200).json({
      success: true,
      message: "An OTP for reset password has been sent to your email.",
    });
  } catch (error) {
    console.error("Error requesting reset password OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during reset password request.",
    });
  }
};

const verifyResetPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    const user = await User.findOne({ email }).select(
      "+resetPasswordToken +resetPasswordExpires"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist.",
      });
    }

    const isOtpValid =
      user.resetPasswordToken === otp && user.resetPasswordExpires > Date.now();

    if (!isOtpValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully. You can now set your new password.",
    });
  } catch (error) {
    console.error("Error verifying reset password OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during OTP verification.",
    });
  }
};

const confirmResetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // const isOtpValid =
    //   user.resetPasswordToken === otp && user.resetPasswordExpires > Date.now();

    // if (!isOtpValid) {
    //   return res.status(400).json({
    //     success: false,
    //     message:
    //       "Invalid or expired OTP. Please restart the reset password process.",
    //   });
    // }

    const hashPass = await bcrypt.hash(newPassword, 10);
    user.password = hashPass;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    console.error("Error confirming new password:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during reset password confirmation.",
    });
  }
};

const checkTokenValidation = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No auth token, access denied.",
      });
    }

    const isVerified = getUser(token);
    if (!isVerified) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid or expired token, authorization denied. Please login again.",
      });
    }

    const user = await User.findById(isVerified.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found, authorization denied.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Token validated successfully.",
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        token: token,
      },
    });
  } catch (error) {
    console.error("Token validation error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  handleUserSignUp,
  handleUserSignIn,
  handleResetPasswordOtpRequest,
  verifyResetPasswordOtp,
  confirmResetPassword,
  checkTokenValidation,
};
