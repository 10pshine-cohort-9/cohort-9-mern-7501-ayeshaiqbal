const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  const status =
    Number.isInteger(err.status) &&
    err.status >= 400 &&
    err.status < 600
      ? err.status
      : 500;

  logger.error(
    {
      error: err.message,
      status,
      method: req.method,
      path: req.originalUrl,
    },
    "Unhandled Exception"
  );

  if (status >= 500) {
    return res.status(status).json({
      message: "Internal Server Error",
    });
  }

  return res.status(status).json({
    message: err.message || "Request failed",
  });
};

module.exports = errorHandler;