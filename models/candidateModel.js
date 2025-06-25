const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    candidateFullName: {
      type: String,
      required: true,
      trim: true,
    },
    candidateLetterType: {
      type: String,
      required: true,
      trim: true,
      enum: ["Offer", "Completion"],
    },
    candidateLetterFile: [
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
