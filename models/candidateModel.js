const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    letterType: {
      type: String,
      required: true,
      trim: true,
      enum: ["Offer", "Completion"],
    },
    letterFile: [
      {
        url: String,
        publicId: String,
        uploadedAt: { type: Date },
        type: {
          type: String,
          enum: ["pdf"],
        },
      },
    ],
  },
  { timestamps: true }
);

const Candidate = mongoose.model("Candidate", candidateSchema);

module.exports = Candidate;
