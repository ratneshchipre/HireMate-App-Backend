const express = require("express");
const router = express.Router();

const {
  handleUserSignUp,
  handleUserSignIn,
  handleResetPasswordOtpRequest,
  verifyResetPasswordOtp,
  confirmResetPassword,
  checkTokenValidation,
} = require("../controllers/userController");

const auth = require("../middlewares/authMiddleware");
const User = require("../models/userModel");

router.post("/is-token-valid", checkTokenValidation);

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({ success: true, ...user._doc, token: req.token });
});

router.post("/sign-up", handleUserSignUp);
router.post("/log-in", handleUserSignIn);
router.post("/reset-password-otp-request", handleResetPasswordOtpRequest);
router.post("/reset-password-verify-otp", verifyResetPasswordOtp);
router.post("/reset-password-confirm", confirmResetPassword);

module.exports = router;
