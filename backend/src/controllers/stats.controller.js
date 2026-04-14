const User = require("../models/User.model");
const Job = require("../models/Job.model");
const Application = require("../models/Application.model");
const Company = require("../models/Company.model");
const asyncHandler = require("../utils/asyncHandler");

const getPublicStats = asyncHandler(async (req, res) => {
    const [
        totalUsers,
        totalJobs,
        totalApplications,
        totalCompanies
    ] = await Promise.all([
        User.countDocuments({ role: { $ne: "admin" }, isBlocked: false }),
        Job.countDocuments({ status: "open" }),
        Application.countDocuments(),
        Company.countDocuments()
    ]);

    res.status(200).json({
        success: true,
        stats: {
            totalUsers,
            totalJobs,
            totalApplications,
            totalCompanies
        }
    });
});

const getEmployerStats = asyncHandler(async (req, res) => {
    const employerId = req.user._id;

    const [
        activeJobs,
        totalApplicants,
        pendingApplications
    ] = await Promise.all([
        Job.countDocuments({ employer: employerId, status: "open" }),
        Application.countDocuments({ employer: employerId }),
        Application.countDocuments({ employer: employerId, status: "pending" })
    ]);

    res.status(200).json({
        success: true,
        stats: {
            activeJobs,
            totalApplicants,
            pendingApplications
        }
    });
});

module.exports = {
    getPublicStats,
    getEmployerStats
};
