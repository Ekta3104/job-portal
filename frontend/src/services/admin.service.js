import apiClient from "../api/axios";

export const adminService = {
  getDashboardStats: () => apiClient.get("/admin/dashboard-stats"),
  getUsers: (params = {}) => apiClient.get("/admin/users", { params }),
  deleteUser: (userId) => apiClient.delete(`/admin/users/${userId}`),
  setUserBlocked: (userId, isBlocked) => apiClient.patch(`/admin/users/${userId}/block`, { isBlocked }),
  setEmployerApproval: (userId, approvalStatus) =>
    apiClient.patch(`/admin/employers/${userId}/approval`, { approvalStatus }),
  getAllJobs: () => apiClient.get("/admin/jobs"),
};
