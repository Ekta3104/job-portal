import apiClient from "../api/axios";

export const authService = {
  register: (payload) => apiClient.post("/auth/register", payload),
  login: (payload) => apiClient.post("/auth/login", payload),
  googleLogin: (payload) => apiClient.post("/auth/google-login", payload),
  verifyOtp: (payload) => apiClient.post("/auth/verify-otp", payload),
  resendOtp: (payload) => apiClient.post("/auth/resend-otp", payload),
  forgotPassword: (payload) => apiClient.post("/auth/forgot-password", payload),
  resetPassword: (token, payload) => apiClient.post(`/auth/reset-password/${token}`, payload),
  getMe: () => apiClient.get("/auth/me"),
};
