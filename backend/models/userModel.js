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

module.exports = {
    findUserByEmail,
    createUser
};