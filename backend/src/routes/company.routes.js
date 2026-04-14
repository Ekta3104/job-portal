const express = require("express");

const {
  createCompany,
  getMyCompany,
  updateMyCompany,
  deleteMyCompany,
  getCompanies,
  getCompanyById,
} = require("../controllers/company.controller");
const {
  protect,
  authorize,
  requirePayment,
  requireEmployerApproval,
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/me/profile", protect, authorize("employer"), requirePayment, getMyCompany);
router.post(
  "/",
  protect,
  authorize("employer"),
  requirePayment,
  requireEmployerApproval,
  createCompany
);
router.put(
  "/me/profile",
  protect,
  authorize("employer"),
  requirePayment,
  requireEmployerApproval,
  updateMyCompany
);
router.delete("/me/profile", protect, authorize("employer"), requirePayment, deleteMyCompany);
router.get("/", getCompanies);
router.get("/:id", getCompanyById);

module.exports = router;
