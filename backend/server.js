require("dotenv").config();

const { connectDB } = require("./config/db");
const app = require("./app");

const port = process.env.PORT || 3000;

const requiredEnv = [
  "JWT_SECRET",
  "DB_HOST",
  "DB_USER",
  "DB_NAME",
  "EMAIL_USER",
  "EMAIL_PASS",
  "FRONTEND_URL",
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Server not started due to database error");
    console.error(err);
    process.exit(1);
  });