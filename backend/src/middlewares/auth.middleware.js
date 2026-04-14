const jwt = require("jsonwebtoken");

const User = require("../models/User.model");
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: token missing",
    });
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: invalid or expired token",
    });
  }

  const user = await User.findById(decoded.userId).select("-password");

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: user does not exist",
    });
  }

  if (user.isBlocked && user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Your account is blocked. Contact admin.",
    });
  }

  req.user = user;
  next();
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: insufficient permissions",
      });
    }

    next();
  };
};

const requireEmployerApproval = (req, res, next) => {
  if (req.user.role !== "employer") {
    return next();
  }

  if (req.user.employerApprovalStatus !== "approved") {
    return res.status(403).json({
      success: false,
      message: "Employer account is not approved by admin yet",
    });
  }

  next();
};

const requirePayment = (req, res, next) => {
  if (req.user.role !== "employer") {
    return next();
  }

  if (req.user.paymentStatus !== "paid") {
    return res.status(402).json({
      success: false,
      message: "Payment required to access this feature.",
    });
  }

  next();
};

module.exports = {
  protect,
  authorize,
  requirePayment,
  requireEmployerApproval,
};
