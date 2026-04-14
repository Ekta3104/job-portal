import apiClient from "../api/axios";

export const jobService = {
  getJobs: (params = {}) => apiClient.get("/jobs", { params }),
  getJobById: (jobId) => apiClient.get(`/jobs/${jobId}`),
  createJob: (payload) => apiClient.post("/jobs", payload),
  updateJob: (jobId, payload) => apiClient.put(`/jobs/${jobId}`, payload),
  deleteJob: (jobId) => apiClient.delete(`/jobs/${jobId}`),
};
