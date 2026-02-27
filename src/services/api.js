import axios from "axios";

const api = axios.create({
 baseURL: "https://deepdrop-backend.onrender.com/api", // backend url
});

// attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
