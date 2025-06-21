const Candidate = require("../models/candidateModel");

const handleCandidateCreation = async (req, res) => {
  const {
    candidateFullName,
    candidateEmail,
    candidateJoiningDate,
    candidateCompletionDate,
  } = req.body;

  if (
    (!candidateFullName,
    !candidateEmail,
    !candidateJoiningDate,
    !candidateCompletionDate)
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const candidate = await Candidate.create({
      candidateFullName,
      candidateEmail,
      candidateJoiningDate,
      candidateCompletionDate,
    });

    return res.status(201).json({
      success: true,
      message: "Candidate data created successfully.",
      candidateData: {
        candidateId: candidate._id,
        fullName: candidate.candidateFullName,
        email: candidate.candidateEmail,
        joiningDate: candidate.candidateJoiningDate,
        completionDate: candidate.candidateCompletionDate,
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

module.exports = {
  handleCandidateCreation,
};
