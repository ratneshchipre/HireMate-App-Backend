const Company = require("../models/companyModel");

const handleAccountSetup = async (req, res) => {
  const { name, address, industry, role, size } = req.body;

  if (!name || !address || !industry || !role || !size) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  try {
    const existingData = await Company.findOne({ userId: req.user });
    if (existingData) {
      return res.status(400).json({
        success: false,
        message: "This company has already been registered.",
      });
    }

    const companyData = await Company.create({
      userId: req.user,
      name,
      address,
      industry,
      role,
      size,
    });

    return res.status(201).json({
      success: true,
      companyData: {
        dataId: companyData._id,
        userId: req.user,
        name: companyData.name,
        address: companyData.address,
        industry: companyData.industry,
        role: companyData.role,
        size: companyData.size,
      },
    });
  } catch (error) {
    console.error("Account setup error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while setting up your account.",
    });
  }
};

module.exports = {
  handleAccountSetup,
};
