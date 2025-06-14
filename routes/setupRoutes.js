const express = require("express");
const router = express.Router();
const { handleAccountSetup } = require("../controllers/setupController");
const auth = require("../middlewares/authMiddleware");

router.post("/setup", auth, handleAccountSetup);

module.exports = router;
