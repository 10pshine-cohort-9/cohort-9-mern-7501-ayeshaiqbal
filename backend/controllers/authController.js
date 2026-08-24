const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const {
  findUserByEmail,
  createUser,
  saveResetToken,
  findUserByResetToken,
  updatePassword,
} = require("../models/userModel");

const { sendResetEmail } = require("../utils/mailer");

const signup = (req, res, next) => {
  const { name, email, password } = req.body;

  logger.info({ email }, "Signup attempt");

  if (!name || !email || !password) {
    logger.warn("Signup failed - required fields missing");

    return res.status(400).json({
      message: "All fields are required",
    });
  }

  findUserByEmail(email, async (err, result) => {
    if (err) {
      logger.error(
        { error: err.message },
        "Signup database error"
      );

      err.status = 500;
      return next(err);
    }

    if (result.length > 0) {
      logger.warn("Signup failed - email already exists");

      return res.status(400).json({
        message: "Email already exists",
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      createUser(name, email, hashedPassword, (err) => {
        if (err) {
          logger.error(
            { error: err.message },
            "User creation failed"
          );

          if (err.code === "ER_DUP_ENTRY") {
            logger.warn("Signup failed - duplicate email");

            return res.status(400).json({
              message: "Email already exists",
            });
          }

          err.status = 500;
          return next(err);
        }

        logger.info(
          { email },
          "User signup successful"
        );

        return res.status(201).json({
          message: "User registered successfully",
        });
      });
    } catch (error) {
      logger.error(
        { error: error.message },
        "Signup error"
      );

      error.status = 500;
      return next(error);
    }
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  logger.info({ email }, "Login attempt");

  if (!email || !password) {
    logger.warn("Login failed - missing credentials");

    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  findUserByEmail(email, async (err, result) => {
    if (err) {
      logger.error(
        { error: err.message },
        "Login database error"
      );

      err.status = 500;
      return next(err);
    }

    if (result.length === 0) {
      logger.warn("Login failed - invalid credentials");

      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    try {
      const user = result[0];

      const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password
      );

      if (!isPasswordCorrect) {
        logger.warn("Login failed - invalid credentials");

        return res.status(400).json({
          message: "Invalid email or password",
        });
      }

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      logger.info(
        { userId: user.id },
        "Login successful"
      );

      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      logger.error(
        { error: error.message },
        "Login error"
      );

      error.status = 500;
      return next(error);
    }
  });
};

const logout = (req, res) => {
  logger.info("User logout successful");

  return res.status(200).json({
    message: "Logout successful",
  });
};

const forgotPassword = (req, res, next) => {
  const { email } = req.body;

  const genericMessage =
    "If an account exists with this email, a password reset link has been sent.";

  logger.info("Forgot password attempt");

  if (!email) {
    logger.warn("Forgot password failed - email missing");

    return res.status(400).json({
      message: "Email is required",
    });
  }

  findUserByEmail(email, (err, result) => {
    if (err) {
      logger.error(
        { error: err.message },
        "Forgot password database error"
      );

      err.status = 500;
      return next(err);
    }

    // Return the same response whether the email exists or not
    // to prevent email enumeration.
    if (result.length === 0) {
      logger.info(
        "Forgot password request completed"
      );

      return res.status(200).json({
        message: genericMessage,
      });
    }

    const user = result[0];

    const resetToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    const expiry = new Date(
      Date.now() + 15 * 60 * 1000
    );

    saveResetToken(
      user.id,
      resetToken,
      expiry,
      async (err) => {
        if (err) {
          logger.error(
            { error: err.message },
            "Failed to save reset token"
          );

          err.status = 500;
          return next(err);
        }

        try {
          await sendResetEmail(
            user.email,
            resetToken
          );

          logger.info(
            { userId: user.id },
            "Password reset email sent successfully"
          );

          return res.status(200).json({
            message: genericMessage,
          });
        } catch (error) {
          logger.error(
            { error: error.message },
            "Failed to send password reset email"
          );

          error.status = 500;
          return next(error);
        }
      }
    );
  });
};

const resetPassword = async (req, res, next) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({
      message: "Token and password are required",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters",
    });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    logger.warn(
      "Password reset failed - invalid or expired token"
    );

    return res.status(400).json({
      message: "Invalid or expired reset token",
    });
  }

  findUserByResetToken(
    token,
    async (err, result) => {
      if (err) {
        logger.error(
          { error: err.message },
          "Reset password database error"
        );

        err.status = 500;
        return next(err);
      }

      if (result.length === 0) {
        logger.warn(
          "Password reset failed - token not found"
        );

        return res.status(400).json({
          message: "Invalid or expired reset token",
        });
      }

      const user = result[0];

      try {
        const hashedPassword = await bcrypt.hash(
          password,
          10
        );

        updatePassword(
          user.id,
          token,
          hashedPassword,
          (err, result) => {
            if (err) {
              logger.error(
                { error: err.message },
                "Password update failed"
              );

              err.status = 500;
              return next(err);
            }

            // Token must still be valid and unused.
            if (result.affectedRows === 0) {
              logger.warn(
                "Password reset failed - token expired or already used"
              );

              return res.status(400).json({
                message: "Invalid or expired reset token",
              });
            }

            logger.info(
              { userId: user.id },
              "Password reset successful"
            );

            return res.status(200).json({
              message: "Password reset successful",
            });
          }
        );
      } catch (error) {
        logger.error(
          { error: error.message },
          "Password hashing failed"
        );

        error.status = 500;
        return next(error);
      }
    }
  );
};

module.exports = {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
};