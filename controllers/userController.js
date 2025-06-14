const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { setUser, getUser } = require("../service/authService");

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

    const token = setUser(user);

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        token: token,
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
      });
    }

    return res.status(201).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  handleUserSignUp,
  handleUserSignIn,
  checkTokenValidation,
};
