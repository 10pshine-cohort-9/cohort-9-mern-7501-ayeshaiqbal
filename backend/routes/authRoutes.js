const express = require("express");
const router = express.Router();

const { signup, login, logout } = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", verifyToken, logout);

// Protected route (JWT test)
router.get("/profile", verifyToken, (req, res) => {
    res.json({
        message: "Protected route accessed",
        user: req.user
    });
});

module.exports = router;