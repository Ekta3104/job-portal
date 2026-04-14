const express = require("express");

const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/job.controller");
const {
  protect,
  authorize,
  requirePayment,
  requireEmployerApproval,
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", getJobs);
router.get("/:id", getJobById);

router.post(
  "/",
  protect,
  authorize("employer"),
  requirePayment,
  requireEmployerApproval,
  createJob
);
router.put(
  "/:id",
  protect,
  authorize("employer", "admin"),
  requirePayment,
  updateJob
);
router.delete(
  "/:id",
  protect,
  authorize("employer", "admin"),
  requirePayment,
  deleteJob
);

module.exports = router;
