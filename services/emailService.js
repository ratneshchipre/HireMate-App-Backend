const nodemailer = require("nodemailer");

require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: parseInt(process.env.BREVO_SMTP_PORT, 10),
  secure: process.env.BREVO_SMTP_PORT === "465",
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Nodemailer-Brevo connection error:", error);
  } else {
    console.log("Nodemailer-Brevo server is ready to send messages!");
  }
});

const sendEmail = async (
  to,
  subject,
  htmlContent,
  textContent = "",
  attachments = [],
  fromEmail,
  ccRecipients = []
) => {
  const mailOptions = {
    from: fromEmail,
    to,
    cc: ccRecipients,
    subject,
    text: textContent,
    html: htmlContent,
    attachments,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

module.exports = {
  sendEmail,
};
