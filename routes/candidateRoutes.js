const express = require("express");
const router = express.Router();

const {
  handleCandidateCreation,
} = require("../controllers/candidateController");
const auth = require("../middlewares/authMiddleware");

router.post("/", auth, handleCandidateCreation);

module.exports = router;
