import apiClient from "../api/axios";

export const companyService = {
  getCompanies: (params = {}) => apiClient.get("/companies", { params }),
  getCompanyById: (companyId) => apiClient.get(`/companies/${companyId}`),
  getMyCompany: () => apiClient.get("/companies/me/profile"),
  createCompany: (payload) => apiClient.post("/companies", payload),
  updateMyCompany: (payload) => apiClient.put("/companies/me/profile", payload),
  deleteMyCompany: () => apiClient.delete("/companies/me/profile"),
};
