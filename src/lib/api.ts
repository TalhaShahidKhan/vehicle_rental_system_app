import axios from "axios";

// Assuming backend is running on default port 5000 based on previous context
const API_URL = "http://localhost:5000/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("rat_token"); // RentRide Auth Token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optional: Auto-logout on 401?
      // localStorage.removeItem("rat_token");
    }
    return Promise.reject(error);
  }
);
