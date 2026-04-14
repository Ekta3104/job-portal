import apiClient from "../api/axios";

export const applicationService = {
  applyToJob: (jobId, payload = {}) => apiClient.post(`/applications/jobs/${jobId}`, payload),
  getMyApplications: () => apiClient.get("/applications/me"),
  getApplicationsForJob: (jobId) => apiClient.get(`/applications/jobs/${jobId}`),
  updateApplicationStatus: (applicationId, status) =>
    apiClient.patch(`/applications/${applicationId}/status`, { status }),
};
