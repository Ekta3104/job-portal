const express = require("express");
const { getPublicStats, getEmployerStats } = require("../controllers/stats.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", getPublicStats);
router.get("/employer", protect, authorize("employer"), getEmployerStats);

module.exports = router;
