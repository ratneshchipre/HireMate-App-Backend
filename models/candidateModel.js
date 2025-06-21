const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    candidateFullName: {
      type: String,
      required: true,
      trim: true,
    },
    candidateEmail: {
      type: String,
      required: true,
      trim: true,
    },
    candidateJoiningDate: {
      type: Date,
      required: true,
      trim: true,
    },
    candidateCompletionDate: {
      type: Date,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Candidate = mongoose.model("Candidate", candidateSchema);

module.exports = Candidate;
