const { connection } = require("../config/db");

const findUserByEmail = (email, callback) => {

    const query = "SELECT * FROM users WHERE email = ?";

    pool.query(query, [email], callback);
};


const createUser = (name, email, password, callback) => {

    const query = `
        INSERT INTO users (name, email, password)
        VALUES (?, ?, ?)
    `;

    pool.query(query, [name, email, password], callback);
};


module.exports = {
    findUserByEmail,
    createUser
};