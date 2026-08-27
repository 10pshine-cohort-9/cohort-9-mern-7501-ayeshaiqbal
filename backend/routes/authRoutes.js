const express = require("express");

const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", verifyToken, logout);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.get("/profile", verifyToken, (req, res) => {
  return res.status(200).json({
    message: "Protected route accessed",
    user: req.user,
  });
});

module.exports = router;