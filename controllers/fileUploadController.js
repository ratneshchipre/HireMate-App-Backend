const uploadToCloudinary = require("../helpers/cloudinaryUpload");
const cloudinary = require("../utils/cloudinary");
const Company = require("../models/companyModel");

const handleFileUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated or invalid user ID.",
      });
    }

    const userId = req.user;
    const company = await Company.findOne({ userId });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    const mimeType = req.file.mimetype;
    let fileType = "";

    if (mimeType.startsWith("image/")) {
      fileType = mimeType.split("/")[1];
    } else if (mimeType === "application/pdf") {
      fileType = "pdf";
    } else {
      return res.status(400).json({
        success: false,
        message: "Unsupported file type.",
      });
    }

    if (company.uploadedFile && company.uploadedFile.publicId) {
      await cloudinary.uploader.destroy(company.uploadedFile.publicId);
    }

    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      "hiremate/company-files",
      mimeType
    );

    if (fileType) {
      company.uploadedFile = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        uploadedAt: new Date(),
        type: fileType,
      };
    }

    await company.save();

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: company.uploadedFile,
    });
  } catch (error) {
    console.error("File upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Error uploading file",
      details: error.message,
    });
  }
};

const getUploadedFile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated or invalid user ID.",
      });
    }

    const userId = req.user;
    const company = await Company.findOne({ userId });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    if (!company.uploadedFile || !company.uploadedFile.url) {
      return res.status(404).json({
        success: false,
        message: "No file uploaded for this company.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "File retrieved successfully.",
      fileData: company.uploadedFile,
    });
  } catch (error) {
    console.error("Error retrieving uploaded file:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving file.",
      details: error.message,
    });
  }
};

const deleteUploadedFile = async (req, res) => {
  const { actualId } = req.params;
  const publicId = `hiremate/company-files/${actualId}`;

  if (!publicId) {
    return res.status(400).json({
      success: false,
      message: "File public ID is required",
    });
  }

  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated or invalid user ID.",
      });
    }

    const userId = req.user;
    const company = await Company.findOne({ userId });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    if (!company.uploadedFile || company.uploadedFile.publicId !== publicId) {
      return res.status(404).json({
        success: false,
        message: "File not found or public ID mismatch.",
      });
    }

    await cloudinary.uploader.destroy(publicId);

    company.uploadedFile = null;
    await company.save();

    return res.status(200).json({
      success: true,
      message: "File deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting file.",
      details: error.message,
    });
  }
};

module.exports = {
  handleFileUpload,
  getUploadedFile,
  deleteUploadedFile,
};
