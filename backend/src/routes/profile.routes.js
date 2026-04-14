const express = require("express");

const {
  getMyProfile,
  updateMyProfile,
} = require("../controllers/profile.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/me", protect, authorize("jobseeker"), getMyProfile);
router.put("/me", protect, authorize("jobseeker"), updateMyProfile);

module.exports = router;
