const express = require("express");

const router = express.Router();

const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const verifyToken = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", verifyToken, logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

module.exports = router;