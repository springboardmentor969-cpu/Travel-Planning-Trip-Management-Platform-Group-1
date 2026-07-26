import axiosClient from "./axiosClient";

export const itineraryApi = {
  getItinerary: async (tripId) => {
    const { data } = await axiosClient.get(`/trips/${tripId}/itinerary`);
    return data;
  },

  addDay: async (tripId, payload) => {
    const { data } = await axiosClient.post(
      `/trips/${tripId}/itinerary/days`,
      payload
    );
    return data;
  },

  removeDay: async (tripId, dayId) => {
    await axiosClient.delete(`/trips/${tripId}/itinerary/days/${dayId}`);
  },

  addActivity: async (tripId, dayId, payload) => {
    const { data } = await axiosClient.post(
      `/trips/${tripId}/itinerary/days/${dayId}/activities`,
      payload
    );
    return data;
  },

  updateActivity: async (tripId, activityId, payload) => {
    const { data } = await axiosClient.put(
      `/trips/${tripId}/itinerary/activities/${activityId}`,
      payload
    );
    return data;
  },

  deleteActivity: async (tripId, activityId) => {
    await axiosClient.delete(
      `/trips/${tripId}/itinerary/activities/${activityId}`
    );
  },

  reorderActivity: async (tripId, activityId, payload) => {
    const { data } = await axiosClient.patch(
      `/trips/${tripId}/itinerary/activities/${activityId}/reorder`,
      payload
    );
    return data;
  },
};

export default itineraryApi;