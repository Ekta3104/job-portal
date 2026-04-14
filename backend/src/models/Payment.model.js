const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        employer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            default: 999, // Default plan fee in INR or your currency
        },
        currency: {
            type: String,
            default: "INR",
        },
        plan: {
            type: String,
            enum: ["basic", "standard", "premium"],
            default: "basic",
        },
        status: {
            type: String,
            enum: ["pending", "completed", "failed", "refunded"],
            default: "pending",
        },
        // Razorpay details
        razorpayOrderId: {
            type: String,
            default: "",
        },
        razorpayPaymentId: {
            type: String,
            default: "",
        },
        razorpaySignature: {
            type: String,
            default: "",
        },
        paymentMethod: {
            type: String,
            default: "razorpay",
        },
        notes: {
            type: String,
            default: "",
        },
        // Admin can mark payment as verified
        verifiedByAdmin: {
            type: Boolean,
            default: false,
        },
        paidAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

paymentSchema.index({ employer: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
