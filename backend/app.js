const express = require("express");
const cors = require("cors");
const pinoHttp = require("pino-http");

const logger = require("./utils/logger");

const authRoutes = require("./routes/authRoutes");
const notesRoutes = require("./routes/notesRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: (process.env.FRONTEND_URL || "http://localhost:5173")
      .split(",")
      .map((value) => value.trim()),
    credentials: true,
  })
);

app.use(
  pinoHttp({
    logger,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;