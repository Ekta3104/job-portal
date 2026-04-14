const express = require("express");

const {
  getDashboardStats,
  getUsers,
  deleteUser,
  updateEmployerApproval,
  toggleUserBlock,
  getAllJobsForAdmin,
  getSuspiciousEmployers,
} = require("../controllers/admin.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/dashboard-stats", getDashboardStats);
router.get("/users", getUsers);
router.delete("/users/:userId", deleteUser);
router.patch("/users/:userId/block", toggleUserBlock);
router.patch("/employers/:userId/approval", updateEmployerApproval);
router.get("/employers/suspicious", getSuspiciousEmployers);
router.get("/jobs", getAllJobsForAdmin);

module.exports = router;
