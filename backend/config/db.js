const mysql = require("mysql2");

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const connectDB = () => {
    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                console.log("Database connection failed");
                reject(err);
            } else {
                console.log("Database connected");
                resolve();
            }
        });
    });
};

module.exports = { connection, connectDB };