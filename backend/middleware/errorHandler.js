const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  logger.error({
      error: err.message,
      stack: err.stack,},
    "Unhandled Exception",
  );

const status = err.status || 500;

res.status(status).json({
  message: status >= 500 ? "Internal Server Error" : err.message,});
};

module.exports = errorHandler;