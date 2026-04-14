const express = require("express");

const {
  register,
  login,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  googleLogin,
  verifyOtp,
  resendOtp,
} = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/google-login", googleLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/me", protect, getCurrentUser);

module.exports = router;
