import api from "../../services/api";

const API = "/trips";

// Get all trips of logged-in user
export const getTrips = () =>
    api.get(API);

// Get one trip
export const getTrip = (id) =>
    api.get(`${API}/${id}`);

// Create trip
export const createTrip = (trip) =>
    api.post(API, trip);

// Update trip
export const updateTrip = (id, trip) =>
    api.put(`${API}/${id}`, trip);

// Delete trip
export const deleteTrip = (id) =>
    api.delete(`${API}/${id}`);

// Share trip
export const shareTrip = (id, email) =>
    api.post(`${API}/${id}/share`, {
        email
    });