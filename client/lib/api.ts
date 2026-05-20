import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Inject JWT token into every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 globally — only redirect if user was previously authenticated
let hasBeenAuthenticated = false;

api.interceptors.response.use(
  (response) => {
    // Track that we've had a successful authenticated request
    if (response.config.headers?.Authorization) {
      hasBeenAuthenticated = true;
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const isAuthPage =
        window.location.pathname === "/login" ||
        window.location.pathname === "/register";

      // Only redirect if user was previously authenticated (avoid loops on initial load)
      if (hasBeenAuthenticated && !isAuthPage) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        hasBeenAuthenticated = false;
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;