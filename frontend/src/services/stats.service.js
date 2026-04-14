import apiClient from "../api/axios";

export const getStats = async () => {
    try {
        const response = await apiClient.get("/stats");
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch stats" };
    }
};

export const getEmployerStats = async () => {
    try {
        const response = await apiClient.get("/stats/employer");
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch employer stats" };
    }
};
