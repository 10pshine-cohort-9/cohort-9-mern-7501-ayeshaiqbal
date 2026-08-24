const logger = require("../utils/logger");

const {
  createNote,
  getNotesByUserId,
  updateNote,
  deleteNote,
} = require("../models/notesModel");

const addNote = (req, res, next) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  logger.info({ userId }, "Create note attempt");

  if (!title || !content) {
    logger.warn(
      { userId },
      "Create note failed - missing fields"
    );

    return res.status(400).json({
      message: "Title and content are required",
    });
  }

  createNote(userId, title, content, (err) => {
    if (err) {
      logger.error(
        {
          error: err.message,
          userId,
        },
        "Create note database error"
      );

      err.status = 500;
      return next(err);
    }

    logger.info(
      { userId },
      "Note created successfully"
    );

    return res.status(201).json({
      message: "Note created successfully",
    });
  });
};

const getNotes = (req, res, next) => {
  const userId = req.user.id;

  logger.info(
    { userId },
    "Fetch notes attempt"
  );

  getNotesByUserId(userId, (err, result) => {
    if (err) {
      logger.error(
        {
          error: err.message,
          userId,
        },
        "Fetch notes database error"
      );

      err.status = 500;
      return next(err);
    }

    logger.info(
      {
        userId,
        totalNotes: result.length,
      },
      "Notes fetched successfully"
    );

    return res.status(200).json(result);
  });
};

const updateUserNote = (req, res, next) => {
  const { title, content } = req.body;
  const userId = req.user.id;
  const noteId = req.params.id;

  logger.info(
    { userId, noteId },
    "Update note attempt"
  );

  if (!title || !content) {
    logger.warn(
      {
        userId,
        noteId,
      },
      "Update note failed - missing fields"
    );

    return res.status(400).json({
      message: "Title and content are required",
    });
  }

  updateNote(
    noteId,
    userId,
    title,
    content,
    (err, result) => {
      if (err) {
        logger.error(
          {
            error: err.message,
            userId,
            noteId,
          },
          "Update note database error"
        );

        err.status = 500;
        return next(err);
      }

      if (result.affectedRows === 0) {
        logger.warn(
          {
            userId,
            noteId,
          },
          "Update failed - note not found"
        );

        return res.status(404).json({
          message: "Note not found",
        });
      }

      logger.info(
        {
          userId,
          noteId,
        },
        "Note updated successfully"
      );

      return res.status(200).json({
        message: "Note updated successfully",
      });
    }
  );
};

const deleteUserNote = (req, res, next) => {
  const noteId = req.params.id;
  const userId = req.user.id;

  logger.info(
    { userId, noteId },
    "Delete note attempt"
  );

  deleteNote(
    noteId,
    userId,
    (err, result) => {
      if (err) {
        logger.error(
          {
            error: err.message,
            userId,
            noteId,
          },
          "Delete note database error"
        );

        err.status = 500;
        return next(err);
      }

      if (result.affectedRows === 0) {
        logger.warn(
          {
            userId,
            noteId,
          },
          "Delete failed - note not found"
        );

        return res.status(404).json({
          message: "Note not found",
        });
      }

      logger.info(
        {
          userId,
          noteId,
        },
        "Note deleted successfully"
      );

      return res.status(200).json({
        message: "Note deleted successfully",
      });
    }
  );
};

module.exports = {
  addNote,
  getNotes,
  updateUserNote,
  deleteUserNote,
};