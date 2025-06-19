const express = require("express");
const router = express.Router();

const {
  handleSendingOtp,
  handleOtpVerification,
} = require("../controllers/otpController");

router
  .post("/send-otp", handleSendingOtp)
  .post("/verify-otp", handleOtpVerification);

module.exports = router;
