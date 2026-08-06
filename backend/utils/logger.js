const pino = require("pino");

const logger = pino({
    level: "info",

    redact: {
        paths: ["email", "userId", "noteId"],
        censor: "***",
    },

    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
        },
    },
});

module.exports = logger;