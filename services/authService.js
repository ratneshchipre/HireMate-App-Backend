const jwt = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.JWT_SECRET;

const setUser = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    secret,
    { expiresIn: "12h" }
  );
};

const getUser = (token) => {
  if (!token) return null;
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = { setUser, getUser };
