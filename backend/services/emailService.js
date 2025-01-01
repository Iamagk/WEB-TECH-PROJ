const nodemailer = require("nodemailer");

// Configure the email transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // Change this if using another email provider
  auth: {
    user: process.env.EMAIL_USER, // Your email address from .env
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

// Function to send a confirmation email
const sendConfirmationEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
  } catch (err) {
    console.error("Error sending email:", err);
    throw new Error("Email could not be sent.");
  }
};

module.exports = { sendConfirmationEmail };
