const express = require("express");

const {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
} = require("../controllers/application.controller");
const {
  protect,
  authorize,
  requireEmployerApproval,
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/jobs/:jobId", protect, authorize("jobseeker"), applyToJob);
router.get("/me", protect, authorize("jobseeker"), getMyApplications);
router.get(
  "/jobs/:jobId",
  protect,
  authorize("employer", "admin"),
  requireEmployerApproval,
  getApplicationsForJob
);
router.patch(
  "/:applicationId/status",
  protect,
  authorize("employer", "admin"),
  requireEmployerApproval,
  updateApplicationStatus
);

module.exports = router;
