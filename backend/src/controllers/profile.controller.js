const User = require("../models/User.model");
const asyncHandler = require("../utils/asyncHandler");

const allowedExperienceLevels = ["fresher", "junior", "mid", "senior"];

const getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    profile: user,
  });
});

const updateMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const allowedFields = [
    "fullName",
    "phone",
    "skills",
    "experienceLevel",
    "resumeUrl",
    "bio",
    "profileImage",
  ];

  allowedFields.forEach((field) => {
    if (typeof req.body[field] !== "undefined") {
      user[field] = req.body[field];
    }
  });

  if (user.experienceLevel && !allowedExperienceLevels.includes(user.experienceLevel)) {
    return res.status(400).json({
      success: false,
      message: "Invalid experienceLevel value",
    });
  }

  await user.save();

  const sanitizedUser = user.toObject();
  delete sanitizedUser.password;

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    profile: sanitizedUser,
  });
});

module.exports = {
  getMyProfile,
  updateMyProfile,
};
