const Application = require("../models/Application.model");
const Job = require("../models/Job.model");
const asyncHandler = require("../utils/asyncHandler");

const applyToJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const { coverLetter = "", resumeUrl = "" } = req.body;

  const job = await Job.findById(jobId);
  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job not found",
    });
  }

  if (job.status !== "open") {
    return res.status(400).json({
      success: false,
      message: "This job is closed",
    });
  }

  const existingApplication = await Application.findOne({
    job: job._id,
    applicant: req.user._id,
  });

  if (existingApplication) {
    return res.status(409).json({
      success: false,
      message: "You have already applied for this job",
    });
  }

  const application = await Application.create({
    job: job._id,
    applicant: req.user._id,
    employer: job.employer,
    coverLetter,
    resumeUrl: resumeUrl || req.user.resumeUrl || "",
  });

  res.status(201).json({
    success: true,
    message: "Application submitted successfully",
    application,
  });
});

const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ applicant: req.user._id })
    .populate({
      path: "job",
      select: "title location jobType experienceLevel status company employer",
      populate: [
        { path: "company", select: "name logoUrl" },
        { path: "employer", select: "fullName email" },
      ],
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    total: applications.length,
    applications,
  });
});

const getApplicationsForJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findById(jobId);
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
      message: "Forbidden: you cannot view these applicants",
    });
  }

  const applications = await Application.find({ job: jobId })
    .populate("applicant", "fullName email phone skills resumeUrl experienceLevel")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    total: applications.length,
    applications,
  });
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  if (!["pending", "accepted", "rejected"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "status must be pending, accepted, or rejected",
    });
  }

  const application = await Application.findById(applicationId).populate("job", "employer");
  if (!application) {
    return res.status(404).json({
      success: false,
      message: "Application not found",
    });
  }

  const isOwnerEmployer =
    req.user.role === "employer" &&
    application.job.employer.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwnerEmployer && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: "Forbidden: you cannot update this application",
    });
  }

  application.status = status;
  application.statusUpdatedAt = new Date();
  await application.save();

  res.status(200).json({
    success: true,
    message: "Application status updated",
    application,
  });
});

module.exports = {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
};
