const express = require("express");
const router = express.Router();

const {
  handleSendingOtp,
  handleOtpVerification,
  handleResendOtp,
} = require("../controllers/otpController");

router
  .post("/send-otp", handleSendingOtp)
  .post("/verify-otp", handleOtpVerification)
  .post("/resend-otp", handleResendOtp);

module.exports = router;
