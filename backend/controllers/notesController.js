const logger = require("../utils/logger");

const {
  createNote,
  getNotesByUserId,
  updateNote,
  deleteNote,
} = require("../models/notesModel");

const addNote = (req, res, next) => {
  const { title, content } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    logger.warn("Create note failed - user not authenticated");

    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  logger.info({ userId }, "Create note attempt");

  if (
    typeof title !== "string" ||
    typeof content !== "string" ||
    !title.trim() ||
    !content.trim()
  ) {
    logger.warn(
      { userId },
      "Create note failed - invalid or missing fields"
    );

    return res.status(400).json({
      message: "Title and content are required",
    });
  }

  createNote(
    userId,
    title.trim(),
    content.trim(),
    (err) => {
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
    }
  );
};

const getNotes = (req, res, next) => {
  const userId = req.user?.id;

  if (!userId) {
    logger.warn("Fetch notes failed - user not authenticated");

    return res.status(401).json({
      message: "Unauthorized",
    });
  }

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
  const userId = req.user?.id;
  const noteId = req.params.id;

  if (!userId) {
    logger.warn("Update note failed - user not authenticated");

    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  if (!noteId) {
    logger.warn(
      { userId },
      "Update note failed - note ID missing"
    );

    return res.status(400).json({
      message: "Note ID is required",
    });
  }

  logger.info(
    { userId, noteId },
    "Update note attempt"
  );

  if (
    typeof title !== "string" ||
    typeof content !== "string" ||
    !title.trim() ||
    !content.trim()
  ) {
    logger.warn(
      {
        userId,
        noteId,
      },
      "Update note failed - invalid or missing fields"
    );

    return res.status(400).json({
      message: "Title and content are required",
    });
  }

  updateNote(
    noteId,
    userId,
    title.trim(),
    content.trim(),
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
  const userId = req.user?.id;

  if (!userId) {
    logger.warn("Delete note failed - user not authenticated");

    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  if (!noteId) {
    logger.warn(
      { userId },
      "Delete note failed - note ID missing"
    );

    return res.status(400).json({
      message: "Note ID is required",
    });
  }

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