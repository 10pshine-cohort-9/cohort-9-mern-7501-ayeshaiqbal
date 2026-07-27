require("dotenv").config();

const { connectDB } = require("./config/db");
const app = require("./app");

const port = process.env.PORT || 3000;

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log("Server started on port " + port);
        });
    })
    .catch((err) => {
        console.log("Server not started due to database error");
        console.log(err);
    });