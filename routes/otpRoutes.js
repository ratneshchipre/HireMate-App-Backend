const express = require("express");
const router = express.Router();

const {
  handleSendingOtpToUser,
  handleSendingOtpToOwner,
  handleOtpVerificationForUser,
  handleOtpVerificationForOwner,
  handleResendOtp,
} = require("../controllers/otpController");

router
  .post("/send-otp/user", handleSendingOtpToUser)
  .post("/send-otp/owner", handleSendingOtpToOwner)
  .post("/verify-otp/user", handleOtpVerificationForUser)
  .post("/verify-otp/owner", handleOtpVerificationForOwner)
  .post("/resend-otp", handleResendOtp);

module.exports = router;
