const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    industry: {
      type: String,
      required: true,
      trim: true,
    },
    uploadedFile: {
      url: String,
      publicId: String,
      uploadedAt: { type: Date },
      type: {
        type: String,
        enum: ["image", "pdf", "jpeg", "png"],
      },
    },
    role: {
      type: String,
      required: true,
      enum: ["HR", "Recruiter", "Admin", "Lead"],
    },
    size: {
      type: String,
      required: true,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    ccRecipients: {
      type: Array,
      trim: true,
    },
  },
  { timestamps: true }
);

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
