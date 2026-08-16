const { connection } = require("../config/db");

const findUserByEmail = (email, callback) => {
  const query = "SELECT * FROM users WHERE email = ?";
  connection.query(query, [email], callback);
};

const createUser = (name, email, password, callback) => {
  const query = `
    INSERT INTO users (name, email, password)
    VALUES (?, ?, ?)
  `;

  connection.query(query, [name, email, password], callback);
};

const saveResetToken = (userId, token, expiry, callback) => {
  const query = `
    UPDATE users
    SET reset_token = ?, reset_token_expiry = ?
    WHERE id = ?
  `;

  connection.query(query, [token, expiry, userId], callback);
};

const findUserByResetToken = (token, callback) => {
  const query = `
    SELECT * FROM users
    WHERE reset_token = ?
    AND reset_token_expiry > NOW()
  `;

  connection.query(query, [token], callback);
};

const updatePassword = (userId, token, password, callback) => {
  const query = `
    UPDATE users
    SET password = ?, reset_token = NULL, reset_token_expiry = NULL
    WHERE id = ?
      AND reset_token = ?
      AND reset_token_expiry > NOW()
  `;

  connection.query(query, [password, userId, token], callback);
};

module.exports = {
  findUserByEmail,
  createUser,
  saveResetToken,
  findUserByResetToken,
  updatePassword,
};