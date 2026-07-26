import axiosClient from "./axiosClient";

export const destinationApi = {
  getDestinations: async (params = {}) => {
    const { data } = await axiosClient.get("/destinations", { params });
    return data;
  },

  getDestinationById: async (destinationId) => {
    const { data } = await axiosClient.get(`/destinations/${destinationId}`);
    return data;
  },

  getAttractions: async (destinationId) => {
    const { data } = await axiosClient.get(
      `/destinations/${destinationId}/attractions`
    );
    return data;
  },

  getWeather: async (destinationId) => {
    const { data } = await axiosClient.get(
      `/destinations/${destinationId}/weather`
    );
    return data;
  },

  getPopularDestinations: async () => {
    const { data } = await axiosClient.get("/destinations/popular");
    return data;
  },

  addFavorite: async (destinationId) => {
    const { data } = await axiosClient.post(
      "/users/me/favorite-destinations",
      { destinationId }
    );
    return data;
  },

  removeFavorite: async (destinationId) => {
    await axiosClient.delete(
      `/users/me/favorite-destinations/${destinationId}`
    );
  },
};

export default destinationApi;