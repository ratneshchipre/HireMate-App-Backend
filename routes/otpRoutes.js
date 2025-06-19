const express = require("express");
const router = express.Router();

const { handleSendingOtp } = require("../controllers/sendOtpController");

router.post("/send-otp", handleSendingOtp);

module.exports = router;
