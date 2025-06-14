const { getUser } = require("../service/authService");

const checkForAuthentication = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No auth token, access denied.",
      });
    }

    const user = getUser(token);
    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid or expired token, authorization denied. Please login again.",
      });
    }

    req.user = user.id;
    req.token = token;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Authentication failed. Please login again.",
    });
  }
};

module.exports = checkForAuthentication;
