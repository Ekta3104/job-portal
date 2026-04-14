const Application = require("../models/Application.model");
const Job = require("../models/Job.model");
const User = require("../models/User.model");
const asyncHandler = require("../utils/asyncHandler");

const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalEmployers,
    pendingEmployers,
    totalJobSeekers,
    totalJobs,
    openJobs,
    totalApplications,
    suspiciousEmployers,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "employer" }),
    User.countDocuments({ role: "employer", employerApprovalStatus: "pending" }),
    User.countDocuments({ role: "jobseeker" }),
    Job.countDocuments(),
    Job.countDocuments({ status: "open" }),
    Application.countDocuments(),
    User.countDocuments({ role: "employer", employerApprovalStatus: "suspicious" }),
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      totalEmployers,
      pendingEmployers,
      totalJobSeekers,
      totalJobs,
      openJobs,
      totalApplications,
      suspiciousEmployers,
    },
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const { role, isBlocked } = req.query;
  const filter = {};

  if (role) {
    filter.role = role;
  }

  if (typeof isBlocked !== "undefined") {
    filter.isBlocked = isBlocked === "true";
  }

  const users = await User.find(filter).select("-password").sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    total: users.length,
    users,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (userId === req.user._id.toString()) {
    return res.status(400).json({
      success: false,
      message: "Admin cannot delete own account",
    });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

const updateEmployerApproval = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { approvalStatus } = req.body;

  if (!["approved", "rejected", "pending", "suspicious"].includes(approvalStatus)) {
    return res.status(400).json({
      success: false,
      message: "approvalStatus must be approved, rejected, pending, or suspicious",
    });
  }

  const employer = await User.findById(userId);
  if (!employer || employer.role !== "employer") {
    return res.status(404).json({
      success: false,
      message: "Employer user not found",
    });
  }

  // Require payment before approving
  if (approvalStatus === "approved" && employer.paymentStatus !== "paid") {
    return res.status(400).json({
      success: false,
      message: "Cannot approve employer: payment has not been completed yet.",
    });
  }

  employer.employerApprovalStatus = approvalStatus;

  // If approved, also set verified and active status
  if (approvalStatus === "approved") {
    employer.isVerified = true;
    employer.membershipStatus = "active";
  } else if (approvalStatus === "rejected") {
    employer.isVerified = false;
    employer.membershipStatus = "none";
  }

  await employer.save();

  res.status(200).json({
    success: true,
    message: `Employer status updated to ${approvalStatus}`,
    user: employer,
  });
});

const toggleUserBlock = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { isBlocked } = req.body;

  if (typeof isBlocked !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "isBlocked must be true or false",
    });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  if (user.role === "admin") {
    return res.status(400).json({
      success: false,
      message: "Admin users cannot be blocked",
    });
  }

  user.isBlocked = isBlocked;
  await user.save();

  res.status(200).json({
    success: true,
    message: isBlocked ? "User blocked" : "User unblocked",
    user,
  });
});

const getAllJobsForAdmin = asyncHandler(async (req, res) => {
  const jobs = await Job.find({})
    .populate("company", "name location")
    .populate("employer", "fullName email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    total: jobs.length,
    jobs,
  });
});

const getSuspiciousEmployers = asyncHandler(async (req, res) => {
  const suspiciousEmployers = await User.find({
    role: "employer",
    employerApprovalStatus: "suspicious",
  }).select("-password").sort({ updatedAt: -1 });

  res.status(200).json({
    success: true,
    total: suspiciousEmployers.length,
    users: suspiciousEmployers,
  });
});

module.exports = {
  getDashboardStats,
  getUsers,
  deleteUser,
  updateEmployerApproval,
  toggleUserBlock,
  getAllJobsForAdmin,
  getSuspiciousEmployers,
};
