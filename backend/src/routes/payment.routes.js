const express = require("express");
const {
    initiatePayment,
    verifyPaymentSignature,
    getMyPayment,
    getAllPayments,
    getPaymentById,
    verifyPaymentAction,
    getPaymentStats,
} = require("../controllers/payment.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();

// Employer routes (must be logged in as employer)
router.post("/", protect, authorize("employer"), initiatePayment);
router.post("/verify-signature", protect, authorize("employer"), verifyPaymentSignature);
router.get("/my-payment", protect, authorize("employer"), getMyPayment);

// Admin routes
router.get("/", protect, authorize("admin"), getAllPayments);
router.get("/stats", protect, authorize("admin"), getPaymentStats);
router.get("/:paymentId", protect, authorize("admin"), getPaymentById);
router.patch("/:paymentId/verify", protect, authorize("admin"), verifyPaymentAction);

module.exports = router;
