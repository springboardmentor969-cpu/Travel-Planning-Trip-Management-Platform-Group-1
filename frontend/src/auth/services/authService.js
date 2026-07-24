import axios from "axios";

const API = "http://localhost:8080/api/auth";

export const login = (data) =>
    axios.post(`${API}/login`, data);

export const register = (data) =>
    axios.post(`${API}/register`, data);

export const forgotPassword = (email) =>
    axios.post(`${API}/forgot-password`, {
        email
    });

export const resetPassword = (data) =>
    axios.post(`${API}/reset-password`, data);