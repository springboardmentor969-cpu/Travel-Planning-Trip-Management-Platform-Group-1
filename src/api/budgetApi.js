import axiosClient from "./axiosClient";

export const budgetApi = {
  getBudget: async (tripId) => {
    const { data } = await axiosClient.get(`/trips/${tripId}/budget`);
    return data;
  },

  updateBudget: async (tripId, payload) => {
    const { data } = await axiosClient.put(`/trips/${tripId}/budget`, payload);
    return data;
  },

  getExpenses: async (tripId) => {
    const { data } = await axiosClient.get(`/trips/${tripId}/expenses`);
    return data;
  },

  addExpense: async (tripId, payload) => {
    const { data } = await axiosClient.post(
      `/trips/${tripId}/expenses`,
      payload
    );
    return data;
  },

  updateExpense: async (tripId, expenseId, payload) => {
    const { data } = await axiosClient.put(
      `/trips/${tripId}/expenses/${expenseId}`,
      payload
    );
    return data;
  },

  deleteExpense: async (tripId, expenseId) => {
    await axiosClient.delete(`/trips/${tripId}/expenses/${expenseId}`);
  },

  uploadReceipt: async (tripId, expenseId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await axiosClient.post(
      `/trips/${tripId}/expenses/${expenseId}/receipt`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data;
  },

  getExpenseReport: async (tripId) => {
    const { data } = await axiosClient.get(
      `/trips/${tripId}/expenses/report`
    );
    return data;
  },
};

export default budgetApi;