const Candidate = require("../models/candidateModel");
const Company = require("../models/companyModel");
const { sendEmail } = require("../services/emailService");

const isValidEmail = (email) => {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
};

const handleFileSendingViaEmail = async (req, res) => {
  try {
    const { companyId, candidateId } = req.params;
    const { ccRecipients } = req.body;

    if (!companyId || !candidateId) {
      return res.status(400).json({
        success: false,
        message: "Company ID and Candidate ID are required.",
      });
    }

    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company data not found.",
      });
    }

    const candidate = await Candidate.findById(candidateId);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate data not found.",
      });
    }

    if (
      ccRecipients &&
      typeof ccRecipients === "string" &&
      ccRecipients.trim() !== ""
    ) {
      company.ccRecipients = ccRecipients
        .split(/[,;]/)
        .map((email) => email.trim())
        .filter((email) => email !== "" && isValidEmail(email));

      if (company.ccRecipients.length === 0 && ccRecipients.trim() !== "") {
        console.warn(`No valid CC emails found in input: "${ccRecipients}"`);
        return res.status(400).json({
          success: false,
          message: "Invalid CC email format provided.",
        });
      }
    }

    await company.save();

    const latestLetterFile = candidate.letterFile.sort(
      (a, b) => b.uploadedAt - a.uploadedAt
    )[0];

    if (!latestLetterFile || !latestLetterFile.url) {
      return res.status(404).json({
        success: false,
        message: "No letter URL found for this candidate.",
      });
    }

    const candidateEmail = candidate.email;
    const candidateFullName = candidate.fullName;
    const companyName = company.name;
    const companyEmail = company.email;
    const companyCCRecipients = company.ccRecipients;
    const documentUrl = latestLetterFile.url;
    const documentTitle = `${candidate.fullName}'s_${candidate.letterType}_Letter`;
    const documentType = latestLetterFile.type;

    if (!documentUrl.startsWith("https://res.cloudinary.com/")) {
      return res.status(500).json({
        success: false,
        message: "Stored document URL is invalid.",
      });
    }

    const emailSubject = `${documentTitle} from ${companyName}`;
    const emailHtml = `
            <p>Dear ${candidateFullName},</p>
            <p>Please find your official document, "${documentTitle}", attached to this email.</p>
            <p>We look forward to your continued association with us.</p>
            <p>Best regards,<br>The Team at ${companyName}</p>
            <p>This is an automated email. Please do not reply directly.</p>
        `;
    const emailText = `Dear ${candidateFullName},\n\nPlease find your official document, "${documentTitle}", attached to this email.\n\nWe look forward to your continued association with us.\n\nBest regards,\nThe Team at ${companyName}\n\nThis is an automated email. Please do not reply directly.`;

    const attachments = [
      {
        filename: `${documentTitle}.${documentType}`,
        href: documentUrl,
        contentType: `application/${documentType}`,
      },
    ];

    await sendEmail(
      candidateEmail,
      emailSubject,
      emailHtml,
      emailText,
      attachments,
      companyEmail,
      companyCCRecipients
    );

    return res.status(200).json({
      success: true,
      message: `Document "${documentTitle}" sent successfully to ${candidateEmail}.`,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Failed to send email. Please try again later.",
      details: error.message,
    });
  }
};

module.exports = {
  handleFileSendingViaEmail,
};
