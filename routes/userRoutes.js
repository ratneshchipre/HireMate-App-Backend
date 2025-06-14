const express = require("express");
const router = express.Router();
const {
  handleUserSignUp,
  handleUserSignIn,
  checkTokenValidation,
} = require("../controllers/userController");

const auth = require("../middlewares/authMiddleware");
const User = require("../models/userModel");

router.post("/is-token-valid", checkTokenValidation);

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({ success: true, ...user._doc, token: req.token });
});

router.post("/sign-up", handleUserSignUp);
router.post("/log-in", handleUserSignIn);

module.exports = router;
