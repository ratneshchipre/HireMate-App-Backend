const User = require("../models/userModel");
const generateOTP = require("../helpers/otpGenerator");
const { sendEmail } = require("../services/emailService");

const handleSendingOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required.",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "If a user with that email exists, a verification code will be sent.",
      });
    }

    const otp = generateOTP();
    const expiryTime = new Date(Date.now() + 10 * 60 * 1000);

    user.verificationCode = otp;
    user.codeExpiresAt = expiryTime;
    await user.save();

    const emailSubject = "Your Verification Code for SaaS App";
    const emailHtml = `
            <p>Dear ${user.fullname},</p>
            <p>Your verification code for SaaS App is: <strong>${otp}</strong>.</p>
            <p>This code is valid for 10 minutes. Please enter it in the app to verify your email address.</p>
            <p>If you did not request this, please ignore this email.</p>
            <p>Thanks,<br>The SaaS App Team</p>
        `;
    const emailText = `Dear ${user.fullname},\n\nYour verification code for SaaS App is: ${otp}. This code is valid for 10 minutes. Please enter it in the app to verify your email address.\n\nIf you did not request this, please ignore this email.\n\nThanks,\nThe SaaS App Team`;

    await sendEmail(email, emailSubject, emailHtml, emailText);

    res.status(200).json({
      success: true,
      message: "Verification code sent to your email.",
    });
  } catch (error) {
    console.error("Error during sending an OTP:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Failed to process your request.",
    });
  }
};

module.exports = {
  handleSendingOtp,
};
