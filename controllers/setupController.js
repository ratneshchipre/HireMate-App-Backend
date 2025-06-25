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
      message: "Company data created successfully.",
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

const getCompanyData = async (req, res) => {
  const { userId } = req.params;

  try {
    const company = await Company.findOne({ userId });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found, try again later.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Company data fetched successfully.",
      companyData: {
        dataId: company._id,
        userId: company.userId,
        name: company.name,
        address: company.address,
        industry: company.industry,
        role: company.role,
        size: company.size,
      },
    });
  } catch (error) {
    console.error("Error fetching company data:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching company data.",
    });
  }
};

const updateCompanyData = async (req, res) => {
  const { userId } = req.params;
  const { name, address, industry, role, size } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "No user found.",
    });
  }

  // if (!name || !address || !industry || !role || !size) {
  //   return res.status(400).json({
  //     success: false,
  //     message: "All fields are required.",
  //   });
  // }

  try {
    const company = await Company.findOneAndUpdate(
      {
        userId,
      },
      {
        name,
        address,
        industry,
        role,
        size,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Failed to update company data.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Company data updated successfully.",
      companyData: {
        dataId: company._id,
        name: company.name,
        address: company.address,
        industry: company.industry,
        role: company.role,
        size: company.size,
      },
    });
  } catch (error) {
    console.error("Error updating company data:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating company data.",
    });
  }
};

module.exports = {
  handleAccountSetup,
  getCompanyData,
  updateCompanyData,
};
