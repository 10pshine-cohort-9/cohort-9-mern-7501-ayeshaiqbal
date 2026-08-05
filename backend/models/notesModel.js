const { connection } = require("../config/db");
const createNote = (userId, title, content, callback) => {
  const query = "INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)";
  connection.query(query, [userId, title, content], callback);
};
const getNotesByUserId = (userId, callback) => {
  const query = "SELECT * FROM notes WHERE user_id = ?";
  connection.query(query, [userId], callback);
};
const updateNote = (noteId, userId, title, content, callback) => {
  const query =
    "UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?";

  connection.query(query, [title, content, noteId, userId], callback);
};

const deleteNote = (noteId, userId, callback) => {
    const query = "DELETE FROM notes WHERE id = ? AND user_id = ?";

    connection.query(query, [noteId, userId], callback);
};
module.exports = {
  createNote,
  getNotesByUserId,
  updateNote,
   deleteNote,
};
