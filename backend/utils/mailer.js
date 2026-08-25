const nodemailer = require("nodemailer");
const logger = require("./logger");

const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASS;
const frontendUrl = process.env.FRONTEND_URL;

if (!emailUser || !emailPassword) {
  logger.warn(
    "Email configuration is missing. Password reset emails may not work."
  );
}

if (!frontendUrl) {
  logger.warn(
    "FRONTEND_URL is missing. Password reset links may not work."
  );
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: emailPassword,
  },
});

const sendResetEmail = async (email, resetToken) => {
  if (!email || !resetToken) {
    throw new Error("Email and reset token are required");
  }

  if (!frontendUrl) {
    throw new Error("FRONTEND_URL is not configured");
  }

  const resetLink =
    `${frontendUrl.replace(/\/$/, "")}` +
    `/reset-password?token=${encodeURIComponent(resetToken)}`;

  const mailOptions = {
    from: `"Notes App" <${emailUser}>`,
    to: email,
    subject: "Notes App - Password Reset",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>Reset Your Password</h2>

        <p>Hello,</p>

        <p>
          We received a request to reset your Notes App password.
        </p>

        <p>
          Click the button below to create a new password:
        </p>

        <a
          href="${resetLink}"
          style="
            display: inline-block;
            padding: 12px 22px;
            background-color: #7c3aed;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
          "
        >
          Reset Password
        </a>

        <p style="margin-top: 20px;">
          This link will expire in <strong>15 minutes</strong>.
        </p>

        <p>
          If you did not request a password reset,
          you can safely ignore this email.
        </p>

        <p>
          Regards,<br />
          Notes App Team
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);

    logger.info(
      "Password reset email sent successfully"
    );
  } catch (error) {
    logger.error(
      {
        error: error.message,
      },
      "Password reset email delivery failed"
    );

    throw error;
  }
};

module.exports = {
  sendResetEmail,
};