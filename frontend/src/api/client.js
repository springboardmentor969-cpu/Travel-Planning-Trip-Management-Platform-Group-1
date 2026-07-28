import axios from 'axios';

export const api = axios.create({
  // In development Vite forwards this path to Spring Boot, avoiding browser CORS issues.
  // Set VITE_API_URL in production when the API is hosted separately.
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const getErrorMessage = (error) => {
  const data = error?.response?.data;
  const fieldErrors = data?.errors && Object.entries(data.errors)
    .map(([field, message]) => `${field}: ${message}`)
    .join(', ');
  return fieldErrors || data?.message || error?.message || 'Something went wrong';
};
