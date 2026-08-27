const pino = require("pino");

const logger = pino({
  level: process.env.LOG_LEVEL || "info",

  redact: {
    paths: [
      "email",
      "userId",
      "noteId",
      "token",
      "resetToken",
      "password",
      "req.headers.authorization",
      "res.headers.authorization",
    ],
    censor: "***",
  },

  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      singleLine: true,
    },
  },
});

module.exports = logger;