const express = require("express");
const router = express.Router();

const {
  handleCandidateCreation,
  handleCandidateLetterUpload,
  getCandidateData,
  deleteCandidateLetter,
  getAllCompanyCandidates,
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
router.get("/company", auth, getAllCompanyCandidates);
router.get("/:candidateId", auth, getCandidateData);
router.delete(
  "/delete-letter/:candidateId/:actualId",
  auth,
  deleteCandidateLetter
);

module.exports = router;
