import axiosClient, { tokenStorage } from "./axiosClient";

const BASE_URL =
  import.meta?.env?.VITE_API_BASE_URL ||
  "http://localhost:8080/api";

export const authApi = {
  register: (payload) => axiosClient.post("/auth/register", payload),

  login: async (payload) => {
    const { data } = await axiosClient.post("/auth/login", payload);
    tokenStorage.setTokens(data.accessToken, data.refreshToken);
    return data;
  },

  logout: async () => {
    try {
      await axiosClient.post("/auth/logout", {
        refreshToken: tokenStorage.getRefreshToken(),
      });
    } finally {
      tokenStorage.clearTokens();
    }
  },

  getCurrentUser: async () => {
    const { data } = await axiosClient.get("/users/me");
    return data;
  },

  updateProfile: async (payload) => {
    const { data } = await axiosClient.put("/users/me", payload);
    return data;
  },

  changePassword: async (payload) => {
    const { data } = await axiosClient.put("/users/me/password", payload);
    return data;
  },

  forgotPassword: (payload) =>
    axiosClient.post("/auth/forgot-password", payload),

  resetPassword: (payload) =>
    axiosClient.post("/auth/reset-password", payload),

  loginWithGoogle: () => {
    window.location.href = `${BASE_URL.replace(
      "/api",
      ""
    )}/oauth2/authorization/google`;
  },
};

export default authApi;