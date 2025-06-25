const Candidate = require("../models/candidateModel");
const uploadToCloudinary = require("../helpers/cloudinaryUpload");
const cloudinary = require("../utils/cloudinary");

const handleCandidateCreation = async (req, res) => {
  const { fullName, letterType } = req.body;

  if ((!fullName, !letterType)) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const candidate = await Candidate.create({
      fullName,
      letterType,
    });

    return res.status(201).json({
      success: true,
      message: "Candidate data created successfully.",
      candidateData: {
        candidateId: candidate._id,
        fullName: candidate.fullName,
        letterType: candidate.letterType,
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
      if (!candidate.letterFile) {
        candidate.letterFile = [];
      }
      candidate.letterFile.push({
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
      fileData: candidate.letterFile,
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

const getCandidateData = async (req, res) => {
  try {
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
        message: "Candidate data not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Candidate data fetched successfully.",
      candidateData: {
        candidateId: candidate._id,
        fullName: candidate.fullName,
        letterType: candidate.letterType,
        letterFile: candidate.letterFile,
      },
    });
  } catch (error) {
    console.error("Error fetching candidate data:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching candidate data.",
      details: error.message,
    });
  }
};

const deleteCandidateLetter = async (req, res) => {
  const { candidateId, actualId } = req.params;
  const publicId = `candidate-files/${actualId}`;

  if (!candidateId || !publicId) {
    return res.status(400).json({
      success: false,
      message: "Candidate ID and File public ID are required.",
    });
  }

  try {
    const candidate = await Candidate.findById(candidateId);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found.",
      });
    }

    const fileIndex = candidate.letterFile.findIndex(
      (file) => file.publicId === publicId
    );

    if (fileIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "File not found or public ID mismatch.",
      });
    }

    await cloudinary.uploader.destroy(publicId);

    candidate.letterFile.splice(fileIndex, 1);
    await candidate.save();

    return res.status(200).json({
      success: true,
      message: "File deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting candidate file:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting file.",
      details: error.message,
    });
  }
};

module.exports = {
  handleCandidateCreation,
  handleCandidateLetterUpload,
  getCandidateData,
  deleteCandidateLetter,
};
