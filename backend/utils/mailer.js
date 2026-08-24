const nodemailer = require("nodemailer");
const logger = require("./logger");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendResetEmail = async (email, resetToken) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${encodeURIComponent(resetToken)}`;

  const mailOptions = {
    from: `"Notes App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Notes App - Password Reset",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>Reset Your Password</h2>
        <p>Hello,</p>
        <p>We received a request to reset your Notes App password.</p>
        <p>Click the button below to create a new password:</p>
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
          If you did not request a password reset, you can safely ignore this email.
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
  } catch (error) {
    logger.error(
      {
        error: error.message,
        email,
      },
      "Password reset email delivery failed"
    );

    throw error;
  }
};

module.exports = {
  sendResetEmail,
};