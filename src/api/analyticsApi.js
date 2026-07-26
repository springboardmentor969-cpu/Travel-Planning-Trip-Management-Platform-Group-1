import axiosClient from "./axiosClient";

export const analyticsApi = {
  getDashboardSummary: async () => {
    const { data } = await axiosClient.get("/dashboard/summary");
    return data;
  },

  getTravelStats: async () => {
    const { data } = await axiosClient.get("/dashboard/travel-stats");
    return data;
  },
};

export default analyticsApi;