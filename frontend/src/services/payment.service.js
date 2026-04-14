import apiClient from "../api/axios";

export const paymentService = {
    // Employer: initiate a payment (creates Razorpay Order)
    initiatePayment: (payload) => apiClient.post("/payments", payload),

    // Employer: verify Razorpay signature after payment
    verifyRazorpaySignature: (payload) => apiClient.post("/payments/verify-signature", payload),

    // Employer: get own payment status
    getMyPayment: () => apiClient.get("/payments/my-payment"),

    // Admin: get all payments
    getAllPayments: (params = {}) => apiClient.get("/payments", { params }),

    // Admin: get payment stats
    getPaymentStats: () => apiClient.get("/payments/stats"),

    // Admin: get a single payment
    getPaymentById: (paymentId) => apiClient.get(`/payments/${paymentId}`),

    // Admin: verify a payment (manual admin verification)
    verifyPayment: (paymentId) => apiClient.patch(`/payments/${paymentId}/verify`),
};
