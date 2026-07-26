import axiosClient from "./axiosClient";

export const mediaApi = {
  getDocuments: async (tripId, type) => {
    const { data } = await axiosClient.get(`/trips/${tripId}/documents`, {
      params: type ? { type } : {},
    });
    return data;
  },

  uploadDocument: async (tripId, file, type, onUploadProgress) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    const { data } = await axiosClient.post(
      `/trips/${tripId}/documents`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress,
      }
    );
    return data;
  },

  deleteDocument: async (tripId, documentId) => {
    await axiosClient.delete(`/trips/${tripId}/documents/${documentId}`);
  },

  getPhotos: async (tripId) => {
    const { data } = await axiosClient.get(`/trips/${tripId}/photos`);
    return data;
  },
};

export default mediaApi;