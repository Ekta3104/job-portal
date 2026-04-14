const Company = require("../models/Company.model");
const asyncHandler = require("../utils/asyncHandler");
const mongoose = require("mongoose");

const createCompany = asyncHandler(async (req, res) => {
  const {
    name,
    website = "",
    location = "",
    description = "",
    logoUrl = "",
    employeeCount = "1-10",
    industry = "",
  } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Company name is required",
    });
  }

  const existingCompany = await Company.findOne({ owner: req.user._id });
  if (existingCompany) {
    return res.status(409).json({
      success: false,
      message: "Employer already has a company profile",
    });
  }

  const company = await Company.create({
    name,
    website,
    location,
    description,
    logoUrl,
    owner: req.user._id,
    employeeCount,
    industry,
  });

  res.status(201).json({
    success: true,
    message: "Company profile created successfully",
    company,
  });
});

const getMyCompany = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ owner: req.user._id }).populate(
    "owner",
    "fullName email role employerApprovalStatus"
  );

  if (!company) {
    return res.status(404).json({
      success: false,
      message: "Company profile not found",
    });
  }

  res.status(200).json({
    success: true,
    company,
  });
});

const updateMyCompany = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ owner: req.user._id });

  if (!company) {
    return res.status(404).json({
      success: false,
      message: "Company profile not found",
    });
  }

  const allowedFields = [
    "name",
    "website",
    "location",
    "description",
    "logoUrl",
    "employeeCount",
    "industry",
  ];

  allowedFields.forEach((field) => {
    if (typeof req.body[field] !== "undefined") {
      company[field] = req.body[field];
    }
  });

  await company.save();

  res.status(200).json({
    success: true,
    message: "Company profile updated successfully",
    company,
  });
});

const deleteMyCompany = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ owner: req.user._id });

  if (!company) {
    return res.status(404).json({
      success: false,
      message: "Company profile not found",
    });
  }

  await company.deleteOne();

  res.status(200).json({
    success: true,
    message: "Company profile deleted successfully",
  });
});

const getCompanies = asyncHandler(async (req, res) => {
  const { q, industry, location, page = 1, limit = 10, sort = "-createdAt" } = req.query;

  const filter = {};

  if (q) {
    filter.$text = { $search: q };
  }

  if (industry) {
    filter.industry = { $regex: industry, $options: "i" };
  }

  if (location) {
    filter.location = { $regex: location, $options: "i" };
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const [companies, total] = await Promise.all([
    Company.find(filter).populate("owner", "fullName email").sort(sort).skip(skip).limit(limitNumber),
    Company.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    total,
    page: pageNumber,
    pages: Math.ceil(total / limitNumber),
    companies,
  });
});

const getCompanyById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid company id",
    });
  }

  const company = await Company.findById(id).populate("owner", "fullName email");

  if (!company) {
    return res.status(404).json({
      success: false,
      message: "Company not found",
    });
  }

  res.status(200).json({
    success: true,
    company,
  });
});

module.exports = {
  createCompany,
  getMyCompany,
  updateMyCompany,
  deleteMyCompany,
  getCompanies,
  getCompanyById,
};
