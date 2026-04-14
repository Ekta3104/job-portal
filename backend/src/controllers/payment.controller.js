const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment.model");
const User = require("../models/User.model");
const asyncHandler = require("../utils/asyncHandler");

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Plan pricing configuration
const PLANS = {
    basic: { amount: 999, label: "Basic Plan", jobPostLimit: 5 },
    standard: { amount: 2499, label: "Standard Plan", jobPostLimit: 20 },
    premium: { amount: 4999, label: "Premium Plan", jobPostLimit: 999 },
};

// ─── EMPLOYER: Create Razorpay Order ──────────────────────────────────────────
const initiatePayment = asyncHandler(async (req, res) => {
    const { plan = "basic" } = req.body;
    const employerId = req.user._id;

    if (!PLANS[plan]) {
        return res.status(400).json({ success: false, message: "Invalid plan selected" });
    }

    // Check for an existing completed payment (employer already paid)
    const existingCompleted = await Payment.findOne({ employer: employerId, status: "completed" });
    if (existingCompleted) {
        return res.status(400).json({
            success: false,
            message: "You have already made a payment. Awaiting admin approval.",
        });
    }

    const amountInPaise = PLANS[plan].amount * 100; // Razorpay expects amount in paise

    const options = {
        amount: amountInPaise,
        currency: "INR",
        receipt: `receipt_plan_${plan}_${Date.now()}`,
        notes: {
            employerId: employerId.toString(),
            plan: plan
        }
    };

    try {
        const order = await razorpay.orders.create(options);

        // Create a pending payment record
        await Payment.create({
            employer: employerId,
            amount: PLANS[plan].amount,
            plan,
            razorpayOrderId: order.id,
            status: "pending",
        });

        res.status(201).json({
            success: true,
            order,
            key_id: process.env.RAZORPAY_KEY_ID,
            plans: PLANS,
        });
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        res.status(500).json({ success: false, message: "Failed to create payment order" });
    }
});

// ─── EMPLOYER: Verify Payment ────────────────────────────────────────────────
const verifyPaymentSignature = asyncHandler(async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = req.body;

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // Update payment record
    const payment = await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
            status: "completed",
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            paidAt: new Date()
        },
        { new: true }
    );

    if (!payment) {
        return res.status(404).json({ success: false, message: "Payment record not found" });
    }

    // Automatic Verification Logic
    const user = await User.findById(payment.employer);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    // 1. Check for generic email domain
    const genericDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com", "aol.com"];
    const emailDomain = user.email.split("@")[1]?.toLowerCase();
    const isGenericEmail = genericDomains.includes(emailDomain);

    // 2. Check if website is provided
    const hasWebsite = user.websiteUrl && user.websiteUrl.trim() !== "";

    let isVerified = false;
    let membershipStatus = "none";
    let employerApprovalStatus = "pending";

    if (!isGenericEmail && hasWebsite) {
        // Passed automated checks
        isVerified = true;
        membershipStatus = "active";
        employerApprovalStatus = "approved";
    } else {
        // Failed automated checks - suspicious
        isVerified = false;
        membershipStatus = "none";
        employerApprovalStatus = "suspicious";
    }

    // Update user status
    user.paymentStatus = "paid";
    user.isVerified = isVerified;
    user.membershipStatus = membershipStatus;
    user.employerApprovalStatus = employerApprovalStatus;
    await user.save();

    res.status(200).json({
        success: true,
        message: isVerified
            ? "Payment verified and account activated successfully!"
            : "Payment verified, but your account requires manual review due to suspicious data (e.g., generic email or missing website).",
        payment,
        isVerified,
        employerApprovalStatus,
        user: {
            ...user.toObject(),
            password: ""
        }
    });
});

// ─── EMPLOYER: Get own payment status ─────────────────────────────────────────
const getMyPayment = asyncHandler(async (req, res) => {
    const payment = await Payment.findOne({ employer: req.user._id })
        .sort({ createdAt: -1 });

    const user = await User.findById(req.user._id).select("paymentStatus employerApprovalStatus");

    res.status(200).json({
        success: true,
        payment,
        paymentStatus: user.paymentStatus,
        approvalStatus: user.employerApprovalStatus,
        plans: PLANS,
    });
});

// ─── ADMIN: Get all payments ───────────────────────────────────────────────────
const getAllPayments = asyncHandler(async (req, res) => {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const payments = await Payment.find(filter)
        .populate("employer", "fullName email employerApprovalStatus paymentStatus")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        total: payments.length,
        payments,
    });
});

// ─── ADMIN: Get single payment by ID ─────────────────────────────────────────
const getPaymentById = asyncHandler(async (req, res) => {
    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId).populate(
        "employer",
        "fullName email employerApprovalStatus paymentStatus"
    );

    if (!payment) {
        return res.status(404).json({ success: false, message: "Payment not found" });
    }

    res.status(200).json({ success: true, payment });
});

// ─── ADMIN: Verify payment (mark as admin‑verified) ───────────────────────────
const verifyPaymentAction = asyncHandler(async (req, res) => {
    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId);

    if (!payment) {
        return res.status(404).json({ success: false, message: "Payment not found" });
    }

    if (payment.status !== "completed") {
        return res.status(400).json({
            success: false,
            message: "Only completed payments can be verified",
        });
    }

    payment.verifiedByAdmin = true;
    await payment.save();

    res.status(200).json({
        success: true,
        message: "Payment verified by admin.",
        payment,
    });
});

// ─── ADMIN: Get payment stats ─────────────────────────────────────────────────
const getPaymentStats = asyncHandler(async (req, res) => {
    const [totalPayments, completedPayments, pendingPayments, verifiedPayments] =
        await Promise.all([
            Payment.countDocuments(),
            Payment.countDocuments({ status: "completed" }),
            Payment.countDocuments({ status: "pending" }),
            Payment.countDocuments({ status: "completed", verifiedByAdmin: true }),
        ]);

    // Total revenue
    const revenueResult = await Payment.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    res.status(200).json({
        success: true,
        stats: {
            totalPayments,
            completedPayments,
            pendingPayments,
            verifiedPayments,
            totalRevenue,
        },
    });
});

module.exports = {
    initiatePayment,
    verifyPaymentSignature,
    getMyPayment,
    getAllPayments,
    getPaymentById,
    verifyPaymentAction,
    getPaymentStats,
    PLANS,
};
