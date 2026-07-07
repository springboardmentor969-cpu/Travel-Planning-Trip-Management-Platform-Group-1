import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || 'Something went wrong';
