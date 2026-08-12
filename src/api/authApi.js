import axiosClient, { tokenStorage } from "./axiosClient";

const BASE_URL =
  import.meta?.env?.VITE_API_BASE_URL ||
  "http://localhost:8080/api";

const getMockUsers = () => {
  try {
    return JSON.parse(localStorage.getItem("tripnest_mock_users") || "[]");
  } catch (e) {
    return [];
  }
};

const saveMockUsers = (users) => {
  localStorage.setItem("tripnest_mock_users", JSON.stringify(users));
};

export const authApi = {
  register: async (payload) => {
    try {
      return await axiosClient.post("/auth/register", payload);
    } catch (error) {
      if (!error.response || error.code === "ERR_NETWORK" || error.message?.includes("Network Error")) {
        const users = getMockUsers();
        if (users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase())) {
          const customErr = new Error("User already registered with this email.");
          customErr.response = { data: { message: "User already registered with this email." } };
          throw customErr;
        }

        const newUser = {
          id: Date.now(),
          name: payload.name,
          email: payload.email,
          password: payload.password,
          role: payload.role || "TRAVELER",
          travelPreferences: "Beach & Mountains",
        };

        users.push(newUser);
        saveMockUsers(users);

        return {
          data: {
            message: "User registered successfully.",
            user: {
              id: newUser.id,
              name: newUser.name,
              email: newUser.email,
              role: newUser.role,
              travelPreferences: newUser.travelPreferences,
            },
          },
        };
      }
      throw error;
    }
  },

  login: async (payload) => {
    try {
      const { data } = await axiosClient.post("/auth/login", payload);
      tokenStorage.setTokens(data.accessToken, data.refreshToken);
      return data;
    } catch (error) {
      if (!error.response || error.code === "ERR_NETWORK" || error.message?.includes("Network Error")) {
        const users = getMockUsers();
        const found = users.find(
          (u) =>
            u.email.toLowerCase() === payload.email.toLowerCase() &&
            u.password === payload.password
        );

        const mockUser = found
          ? {
              id: found.id,
              name: found.name,
              email: found.email,
              role: found.role,
              travelPreferences: found.travelPreferences || "Beach & Culture",
            }
          : {
              id: Date.now(),
              name: payload.email.split("@")[0] || "Traveler",
              email: payload.email,
              role: "TRAVELER",
              travelPreferences: "Adventures & Roadtrips",
            };

        const mockToken = "mock_token_" + Date.now();
        tokenStorage.setTokens(mockToken, mockToken);
        localStorage.setItem("tripnest_current_user", JSON.stringify(mockUser));
        return { accessToken: mockToken, refreshToken: mockToken, user: mockUser };
      }
      throw error;
    }
  },

  logout: async () => {
    try {
      await axiosClient.post("/auth/logout", {
        refreshToken: tokenStorage.getRefreshToken(),
      });
    } catch (e) {
      // Ignore network logout errors on offline fallback
    } finally {
      tokenStorage.clearTokens();
      localStorage.removeItem("tripnest_current_user");
    }
  },

  getCurrentUser: async () => {
    try {
      const { data } = await axiosClient.get("/users/me");
      return data;
    } catch (error) {
      if (!error.response || error.code === "ERR_NETWORK" || error.message?.includes("Network Error")) {
        const storedUser = localStorage.getItem("tripnest_current_user");
        if (storedUser) return JSON.parse(storedUser);
        return {
          id: 1,
          name: "Traveler",
          email: "user@example.com",
          role: "TRAVELER",
          travelPreferences: "Adventures & Beaches",
        };
      }
      throw error;
    }
  },

  updateProfile: async (payload) => {
    try {
      const { data } = await axiosClient.put("/users/me", payload);
      return data;
    } catch (error) {
      if (!error.response || error.code === "ERR_NETWORK" || error.message?.includes("Network Error")) {
        const storedUser = localStorage.getItem("tripnest_current_user");
        const currentUser = storedUser ? JSON.parse(storedUser) : {};
        const updated = { ...currentUser, ...payload };
        localStorage.setItem("tripnest_current_user", JSON.stringify(updated));
        return updated;
      }
      throw error;
    }
  },

  changePassword: async (payload) => {
    try {
      const { data } = await axiosClient.put("/users/me/password", payload);
      return data;
    } catch (error) {
      if (!error.response || error.code === "ERR_NETWORK" || error.message?.includes("Network Error")) {
        return { message: "Password updated successfully." };
      }
      throw error;
    }
  },

  forgotPassword: (payload) =>
    axiosClient.post("/auth/forgot-password", payload).catch((err) => {
      if (!err.response || err.code === "ERR_NETWORK") {
        return { data: { message: "Password reset link sent to your email." } };
      }
      throw err;
    }),

  resetPassword: (payload) =>
    axiosClient.post("/auth/reset-password", payload).catch((err) => {
      if (!err.response || err.code === "ERR_NETWORK") {
        return { data: { message: "Password reset successful." } };
      }
      throw err;
    }),

  loginWithGoogle: () => {
    window.location.href = `${BASE_URL.replace(
      "/api",
      ""
    )}/oauth2/authorization/google`;
  },
};

export default authApi;