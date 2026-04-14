const Company = require("../models/Company.model");
const Job = require("../models/Job.model");
const asyncHandler = require("../utils/asyncHandler");

const createJob = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    requirements = [],
    salaryMin = 0,
    salaryMax = 0,
    location,
    jobType,
    experienceLevel,
    applicationDeadline,
    skillsRequired = [],
    companyId,
  } = req.body;

  if (!title || !description || !location || !companyId) {
    return res.status(400).json({
      success: false,
      message: "title, description, location, and companyId are required",
    });
  }

  // Check if employer is verified and has active membership
  if (req.user.role === "employer") {
    if (!req.user.isVerified || req.user.membershipStatus !== "active") {
      return res.status(403).json({
        success: false,
        message: "Your account must be verified and have an active membership to post jobs.",
      });
    }
  }

  const company = await Company.findOne({ _id: companyId, owner: req.user._id });
  if (!company) {
    return res.status(404).json({
      success: false,
      message: "Company not found for this employer",
    });
  }

  const job = await Job.create({
    title,
    description,
    requirements,
    salaryMin,
    salaryMax,
    location,
    jobType,
    experienceLevel,
    applicationDeadline,
    skillsRequired,
    employer: req.user._id,
    company: company._id,
  });

  res.status(201).json({
    success: true,
    message: "Job posted successfully",
    job,
  });
});

const getJobs = asyncHandler(async (req, res) => {
  const {
    q,
    location,
    jobType,
    experienceLevel,
    status,
    page = 1,
    limit = 10,
    sort = "-createdAt",
  } = req.query;

  const filter = {};

  if (q) {
    filter.$text = { $search: q };
  }

  if (location) {
    filter.location = { $regex: location, $options: "i" };
  }

  if (jobType) {
    filter.jobType = jobType;
  }

  if (experienceLevel) {
    filter.experienceLevel = experienceLevel;
  }

  if (status) {
    filter.status = status;
  } else if (!req.user || req.user.role === "jobseeker") {
    filter.status = "open";
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .populate("company", "name logoUrl location")
      .populate("employer", "fullName email")
      .sort(sort)
      .skip(skip)
      .limit(limitNumber),
    Job.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    total,
    page: pageNumber,
    pages: Math.ceil(total / limitNumber),
    jobs,
  });
});

const getJobById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const job = await Job.findById(id)
    .populate("company", "name website description location logoUrl")
    .populate("employer", "fullName email");

  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job not found",
    });
  }

  res.status(200).json({
    success: true,
    job,
  });
});

const updateJob = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const job = await Job.findById(id);
  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job not found",
    });
  }

  const isOwnerEmployer =
    req.user.role === "employer" && job.employer.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwnerEmployer && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: "Forbidden: you cannot update this job",
    });
  }

  const allowedFields = [
    "title",
    "description",
    "requirements",
    "salaryMin",
    "salaryMax",
    "location",
    "jobType",
    "experienceLevel",
    "status",
    "applicationDeadline",
    "skillsRequired",
  ];

  allowedFields.forEach((field) => {
    if (typeof req.body[field] !== "undefined") {
      job[field] = req.body[field];
    }
  });

  await job.save();

  res.status(200).json({
    success: true,
    message: "Job updated successfully",
    job,
  });
});

const deleteJob = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const job = await Job.findById(id);
  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job not found",
    });
  }

  const isOwnerEmployer =
    req.user.role === "employer" && job.employer.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwnerEmployer && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: "Forbidden: you cannot delete this job",
    });
  }

  await job.deleteOne();

  res.status(200).json({
    success: true,
    message: "Job deleted successfully",
  });
});

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
};
