import axiosClient from "./axiosClient";

export const tripApi = {
  getTrips: async (params = {}) => {
    const { data } = await axiosClient.get("/trips", { params });
    return data;
  },

  getTripById: async (tripId) => {
    const { data } = await axiosClient.get(`/trips/${tripId}`);
    return data;
  },

  createTrip: async (payload) => {
    const { data } = await axiosClient.post("/trips", payload);
    return data;
  },

  updateTrip: async (tripId, payload) => {
    const { data } = await axiosClient.put(`/trips/${tripId}`, payload);
    return data;
  },

  deleteTrip: async (tripId) => {
    await axiosClient.delete(`/trips/${tripId}`);
  },

  shareTrip: async (tripId, email) => {
    const { data } = await axiosClient.post(`/trips/${tripId}/share`, {
      email,
    });
    return data;
  },

  getTripTimeline: async (tripId) => {
    const { data } = await axiosClient.get(`/trips/${tripId}/timeline`);
    return data;
  },
};

export default tripApi;