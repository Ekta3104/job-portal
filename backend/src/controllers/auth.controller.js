const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const User = require("../models/User.model");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");
const sendEmail = require("../utils/sendEmail");

const sanitizeUser = (userDoc) => {
  const user = userDoc.toObject ? userDoc.toObject() : userDoc;
  delete user.password;
  return user;
};

const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, role, companyName, websiteUrl } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "fullName, email, and password are required",
    });
  }

  const allowedRoles = ["jobseeker", "employer"];
  const userRole = role && allowedRoles.includes(role) ? role : "jobseeker";

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "Email is already registered",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const user = await User.create({
    fullName,
    email,
    password,
    role: userRole,
    companyName: userRole === "employer" ? companyName : "",
    websiteUrl: userRole === "employer" ? websiteUrl : "",
    employerApprovalStatus: userRole === "employer" ? "pending" : "approved",
    otp,
    otpExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
  });

  // If employer, create initial company profile
  if (userRole === "employer") {
    const Company = require("../models/Company.model");
    await Company.create({
      name: companyName || fullName,
      website: websiteUrl || "",
      owner: user._id,
    });
  }

  try {
    const html = `
      <p>Hello ${user.fullName},</p>
      <p>Welcome to Job Portal! Your OTP for registration is: <strong>${otp}</strong></p>
      <p>It is valid for 10 minutes.</p>
    `;
    await sendEmail({
      to: user.email,
      subject: "Welcome to Job Portal - Verify your Email",
      html,
    });
  } catch (error) {
    console.error("Email error:", error);
  }

  res.status(201).json({
    success: true,
    message: "Registration successful. Please check your email for the OTP.",
    email: user.email,
    requiresOTP: true,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "email and password are required",
    });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  if (user.isBlocked && user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Your account is blocked. Contact admin.",
    });
  }

  // We allow employers to login so they can access the payment page and view their verification status.
  // Restrictions on job posting are handled in the Job Controller.

  // Instead of sending the token immediately, send an OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
  await user.save();

  try {
    const html = `
      <p>Hello ${user.fullName},</p>
      <p>Your OTP for login is: <strong>${otp}</strong></p>
      <p>It is valid for 10 minutes.</p>
    `;
    await sendEmail({
      to: user.email,
      subject: "Job Portal Login OTP",
      html,
    });
  } catch (error) {
    console.error("Email error:", error);
  }

  res.status(200).json({
    success: true,
    message: "OTP sent to your email",
    email: user.email,
    requiresOTP: true,
  });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "email is required",
    });
  }

  const user = await User.findOne({ email }).select("+passwordResetToken +passwordResetExpires");

  // Do not reveal if email exists or not.
  if (!user) {
    return res.status(200).json({
      success: true,
      message: "If this email is registered, a reset link has been sent.",
    });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

  const html = `
    <p>Hello ${user.fullName},</p>
    <p>You requested a password reset for your Job Portal account.</p>
    <p>Click the link below to reset your password (valid for 15 minutes):</p>
    <p><a href="${resetUrl}">${resetUrl}</a></p>
    <p>If you did not request this, you can ignore this email.</p>
  `;

  try {
    await sendEmail({
      to: user.email,
      subject: "Job Portal Password Reset",
      html,
    });
  } catch (error) {
    user.passwordResetToken = "";
    user.passwordResetExpires = null;
    await user.save({ validateBeforeSave: false });

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send reset email",
    });
  }

  res.status(200).json({
    success: true,
    message: "If this email is registered, a reset link has been sent.",
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "password must be at least 6 characters",
    });
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  }).select("+passwordResetToken +passwordResetExpires");

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Reset token is invalid or expired",
    });
  }

  user.password = password;
  user.passwordResetToken = "";
  user.passwordResetExpires = null;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successful. You can now login.",
  });
});

const googleLogin = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({
      success: false,
      message: "idToken is required",
    });
  }

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { sub: googleId, email, name, picture } = payload;

  let user = await User.findOne({ email });

  if (!user) {
    // New user from Google
    user = await User.create({
      fullName: name,
      email,
      googleId,
      profileImage: picture,
      // Default password since Google users don't have one
      password: crypto.randomBytes(16).toString("hex"),
      role: "jobseeker",
      employerApprovalStatus: "approved", // Default for jobseekers
      isEmailVerified: true,
    });
  } else if (!user.googleId) {
    // Existing local user logging in via Google for the first time
    user.googleId = googleId;
    if (!user.profileImage) {
      user.profileImage = picture;
    }
    await user.save();
  }

  if (user.isBlocked && user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Your account is blocked. Contact admin.",
    });
  }

  const token = generateToken(user._id, user.role);

  res.status(200).json({
    success: true,
    message: "Google login successful",
    token,
    user: sanitizeUser(user),
  });
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Email and OTP are required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ success: false, message: "User not found" });
  }

  if (user.otp !== otp || user.otpExpires < Date.now()) {
    return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
  }

  user.isEmailVerified = true;
  user.otp = "";
  user.otpExpires = null;
  await user.save();

  const token = generateToken(user._id, user.role);

  res.status(200).json({
    success: true,
    message: user.role === "employer" ? "Verified. Please complete membership payment for account activation if required." : "Verified successfully",
    token,
    user: sanitizeUser(user),
  });
});

const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ success: false, message: "User not found" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
  await user.save();

  try {
    const html = `
      <p>Hello ${user.fullName},</p>
      <p>Your new OTP is: <strong>${otp}</strong></p>
      <p>It is valid for 10 minutes.</p>
    `;
    await sendEmail({
      to: user.email,
      subject: "Your New OTP",
      html,
    });
    res.status(200).json({ success: true, message: "A new OTP has been sent to your email" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP email" });
  }
});

module.exports = {
  register,
  login,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  googleLogin,
  verifyOtp,
  resendOtp,
};
