const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    logger.warn("Authentication failed - token missing");

    return res.status(401).json({
      message: "Access denied. Token is missing",
    });
  }

  const [scheme, token] = authHeader.trim().split(/\s+/);

  if (
    !scheme ||
    scheme.toLowerCase() !== "bearer" ||
    !token
  ) {
    logger.warn(
      "Authentication failed - invalid authorization format"
    );

    return res.status(401).json({
      message: "Invalid authorization format",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (!decoded || !decoded.id) {
      logger.warn(
        "Authentication failed - invalid token payload"
      );

      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }

    req.user = decoded;

    return next();
  } catch (error) {
    logger.warn(
      { error: error.message },
      "Authentication failed - invalid or expired token"
    );

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = verifyToken;