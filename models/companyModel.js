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
    logoUrl: String,
    role: {
      type: String,
      required: true,
      enum: ["HR", "Recruiter", "Admin", "Lead"],
    },
    size: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Company = mongoose.model("company", companySchema);

module.exports = Company;
