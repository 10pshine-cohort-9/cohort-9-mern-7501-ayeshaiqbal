const express = require("express");
const router = express.Router();

const {addNote,getNotes,updateUserNote,deleteUserNote} = require("../controllers/notesController");

const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, addNote);
router.get("/", verifyToken, getNotes);
router.put("/:id", verifyToken, updateUserNote);
router.delete("/:id", verifyToken, deleteUserNote);

module.exports = router;