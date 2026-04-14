const express = require("express");

const authRoutes = require("./auth.routes");
const jobRoutes = require("./job.routes");
const applicationRoutes = require("./application.routes");
const adminRoutes = require("./admin.routes");
const companyRoutes = require("./company.routes");
const profileRoutes = require("./profile.routes");
const statsRoutes = require("./stats.routes");
const paymentRoutes = require("./payment.routes");

const router = express.Router();

// Base health check route to confirm API is reachable.
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/jobs", jobRoutes);
router.use("/applications", applicationRoutes);
router.use("/admin", adminRoutes);
router.use("/companies", companyRoutes);
router.use("/profile", profileRoutes);
router.use("/stats", statsRoutes);
router.use("/payments", paymentRoutes);

module.exports = router;
