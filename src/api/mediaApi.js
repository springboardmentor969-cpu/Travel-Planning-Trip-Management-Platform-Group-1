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

  downloadDocument: async (tripId, documentId, fileName) => {
    const response = await axiosClient.get(
      `/trips/${tripId}/documents/${documentId}/download`,
      { responseType: "blob" }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName || "document");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  getPhotos: async (tripId) => {
    const { data } = await axiosClient.get(`/trips/${tripId}/photos`);
    return data;
  },
};

export default mediaApi;