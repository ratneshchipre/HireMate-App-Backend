const express = require("express");
const router = express.Router();

const {
  handleSendingOtpToUser,
  handleSendingOtpToOwner,
  handleOtpVerificationForUser,
  handleOtpVerificationForOwner,
  handleResendOtpForUser,
  handleResendOtpForOwner,
} = require("../controllers/otpController");

router
  .post("/send-otp/user", handleSendingOtpToUser)
  .post("/send-otp/owner", handleSendingOtpToOwner)
  .post("/verify-otp/user", handleOtpVerificationForUser)
  .post("/verify-otp/owner", handleOtpVerificationForOwner)
  .post("/resend-otp/user", handleResendOtpForUser)
  .post("/resend-otp/owner", handleResendOtpForOwner);

module.exports = router;
