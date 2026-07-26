import axiosClient from "./axiosClient";

export const notificationApi = {
  getNotifications: async (params = {}) => {
    const { data } = await axiosClient.get("/notifications", { params });
    return data;
  },

  getUnreadCount: async () => {
    const { data } = await axiosClient.get("/notifications/unread-count");
    return data.count;
  },

  markAsRead: async (notificationId) => {
    await axiosClient.put(`/notifications/${notificationId}/read`);
  },

  markAllAsRead: async () => {
    await axiosClient.put("/notifications/read-all");
  },

  deleteNotification: async (notificationId) => {
    await axiosClient.delete(`/notifications/${notificationId}`);
  },

  getPreferences: async () => {
    const { data } = await axiosClient.get("/notifications/preferences");
    return data;
  },

  updatePreferences: async (payload) => {
    const { data } = await axiosClient.put(
      "/notifications/preferences",
      payload
    );
    return data;
  },
};

export default notificationApi;