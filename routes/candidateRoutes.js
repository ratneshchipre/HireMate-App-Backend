const express = require("express");
const router = express.Router();

const {
  handleCandidateCreation,
  handleCandidateLetterUpload,
} = require("../controllers/candidateController");
const auth = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerMiddleware");

router.post("/create", auth, handleCandidateCreation);
router.post(
  "/upload-letter/:candidateId",
  auth,
  upload.single("file"),
  handleCandidateLetterUpload
);

module.exports = router;
