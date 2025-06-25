const Candidate = require("../models/candidateModel");
const uploadToCloudinary = require("../helpers/cloudinaryUpload");

const handleCandidateCreation = async (req, res) => {
  const { candidateFullName, candidateLetterType } = req.body;

  if ((!candidateFullName, !candidateLetterType)) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const candidate = await Candidate.create({
      candidateFullName,
      candidateLetterType,
    });

    return res.status(201).json({
      success: true,
      message: "Candidate data created successfully.",
      candidateData: {
        candidateId: candidate._id,
        fullName: candidate.candidateFullName,
        letterType: candidate.candidateLetterType,
      },
    });
  } catch (error) {
    console.error("Error creating candidate data:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create candidate data.",
    });
  }
};

const handleCandidateLetterUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    const { candidateId } = req.params;
    if (!candidateId) {
      return res.status(400).json({
        success: false,
        message: "Candidate ID is required.",
      });
    }

    const candidate = await Candidate.findById(candidateId);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found.",
      });
    }

    const mimeType = req.file.mimetype;
    let fileType = "";

    if (mimeType === "application/pdf") {
      fileType = "pdf";
    } else {
      return res.status(400).json({
        success: false,
        message: "Unsupported file type. Only PDF is allowed.",
      });
    }

    const letterUploadResult = await uploadToCloudinary(
      req.file.buffer,
      "candidate-files"
    );

    if (fileType) {
      if (!candidate.candidateLetterFile) {
        candidate.candidateLetterFile = [];
      }
      candidate.candidateLetterFile.push({
        url: letterUploadResult.secure_url,
        publicId: letterUploadResult.public_id,
        uploadedAt: new Date(),
        type: fileType,
      });
    }

    await candidate.save();

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      fileData: candidate.candidateLetterFile,
    });
  } catch (error) {
    console.error("Candidate file upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Error uploading file.",
      details: error.message,
    });
  }
};

module.exports = {
  handleCandidateCreation,
  handleCandidateLetterUpload,
};
