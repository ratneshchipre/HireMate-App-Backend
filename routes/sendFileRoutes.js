const express = require("express");
const router = express.Router();

const {
  handleFileSendingViaEmail,
} = require("../controllers/sendFileController");
const auth = require("../middlewares/authMiddleware");

router.post(
  "/send-file/:companyId/:candidateId",
  auth,
  handleFileSendingViaEmail
);

module.exports = router;
