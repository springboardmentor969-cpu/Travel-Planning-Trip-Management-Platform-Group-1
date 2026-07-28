import { api } from './client';

export const dashboardApi = {
  get: () => api.get('/dashboard').then((res) => res.data)
};

export const destinationApi = {
  list: (params = {}) => api.get('/destinations', { params }).then((res) => res.data),
  get: (id) => api.get(`/destinations/${id}`).then((res) => res.data)
};

export const userApi = {
  create: (payload) => api.post('/users', payload).then((res) => res.data),
  get: (id) => api.get(`/users/${id}`).then((res) => res.data),
  update: (id, payload) => api.put(`/users/${id}`, payload).then((res) => res.data)
};

export const tripApi = {
  list: () => api.get('/trips').then((res) => res.data),
  get: (id) => api.get(`/trips/${id}`).then((res) => res.data),
  details: (id) => api.get(`/trips/${id}/details`).then((res) => res.data),
  create: (payload) => api.post('/trips', payload).then((res) => res.data),
  update: (id, payload) => api.put(`/trips/${id}`, payload).then((res) => res.data),
  remove: (id) => api.delete(`/trips/${id}`)
};

export const itineraryApi = {
  create: (tripId, payload) => api.post(`/trips/${tripId}/itinerary`, payload).then((res) => res.data),
  update: (tripId, id, payload) => api.put(`/trips/${tripId}/itinerary/${id}`, payload).then((res) => res.data),
  remove: (tripId, id) => api.delete(`/trips/${tripId}/itinerary/${id}`)
};

export const expenseApi = {
  list: (tripId) => api.get(`/trips/${tripId}/expenses`).then((res) => res.data),
  create: (tripId, payload) => api.post(`/trips/${tripId}/expenses`, payload).then((res) => res.data),
  update: (tripId, id, payload) => api.put(`/trips/${tripId}/expenses/${id}`, payload).then((res) => res.data),
  remove: (tripId, id) => api.delete(`/trips/${tripId}/expenses/${id}`)
};

export const budgetApi = {
  get: (tripId) => api.get(`/trips/${tripId}/budget`).then((res) => res.data)
};
