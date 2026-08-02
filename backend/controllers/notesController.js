const {
  createNote,
  getNotesByUserId,
  updateNote,
  deleteNote,
} = require("../models/notesModel");

const addNote = (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  if (!title || !content) {
    return res.status(400).json({
      message: "Title and content are required",
    });
  }

  createNote(userId, title, content, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Note not created",
      });
    }

    return res.status(201).json({
      message: "Note created successfully",
    });
  });
};

const getNotes = (req, res) => {
  const userId = req.user.id;

  getNotesByUserId(userId, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Could not fetch notes",
      });
    }

    return res.status(200).json(result);
  });
};
const updateUserNote = (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;
  const noteId = req.params.id;

  if (!title || !content) {
    return res.status(400).json({
      message: "Title and content are required",
    });
  }

  updateNote(noteId, userId, title, content, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Note not updated",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    return res.status(200).json({
      message: "Note updated successfully",
    });
  });
};
const deleteUserNote = (req, res) => {
  const noteId = req.params.id;
  const userId = req.user.id;

  deleteNote(noteId, userId, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Note not deleted",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    return res.status(200).json({
      message: "Note deleted successfully",
    });
  });
};
module.exports = {
  addNote,
  getNotes,
  updateUserNote,
  deleteUserNote,
};
