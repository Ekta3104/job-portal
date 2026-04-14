import apiClient from "../api/axios";

export const profileService = {
  getMyProfile: () => apiClient.get("/profile/me"),
  updateMyProfile: (payload) => apiClient.put("/profile/me", payload),
};
