const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { findUserByEmail, createUser } = require("../models/userModel");

const signup = (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    findUserByEmail(email, async (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Something went wrong"
            });
        }

        if (result.length > 0) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

        createUser(name, email, hashedPassword, (err, result) => {

    if (err) {

        if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        return res.status(500).json({
            message: "User not created"
        });
    }

    res.status(201).json({
        message: "User registered successfully"
    });
});
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Something went wrong"
            });
        }
    });
};

const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    findUserByEmail(email, async (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Something went wrong"
            });
        }

        if (result.length === 0) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        try {
            const user = result[0];

            const isPasswordCorrect = await bcrypt.compare(
                password,
                user.password
            );

            if (!isPasswordCorrect) {
                return res.status(400).json({
                    message: "Invalid email or password"
                });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d"
                }
            );

            res.status(200).json({
                message: "Login successful",
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Something went wrong"
            });
        }
    });
};

module.exports = {
    signup,
    login
};