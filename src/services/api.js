import axios from "axios";

const api = axios.create({
 baseURL: "https://deepdrop-backend2-1.onrender.com/api",
});

// attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      
      // 🔥 Clear auth
      localStorage.removeItem("token");

      // 🔥 Force redirect
      window.location.href = "https://ddeepdrop.netlify.app/get-started";
    }

    return Promise.reject(error);
  }
);

export default api;