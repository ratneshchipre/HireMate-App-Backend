const express = require("express");
const router = express.Router();
const {
  handleAccountSetup,
  getCompanyData,
} = require("../controllers/setupController");
const auth = require("../middlewares/authMiddleware");

router.post("/", auth, handleAccountSetup);
router.get("/:userId", auth, getCompanyData);

module.exports = router;
