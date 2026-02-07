import axios from "axios";
import { authStore } from "../stores/authStore";
import extractErrorMessage from "./httpError";
import { clearAuthStorage, getToken } from "./storage";

const baseURL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:5656/api/v1";

export const http = axios.create({
  baseURL,
  timeout: 15000,
});

http.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (!config.headers["Content-Type"]) {
      const isFormData = config.data instanceof FormData;
      if (!isFormData) {
        config.headers["Content-Type"] = "application/json";
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      // Auto-logout on unauthorized
      clearAuthStorage();
      try {
        authStore.getState().resetAuth();
      } catch {
        /* ignore */
      }
      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }
    return Promise.reject(extractErrorMessage(error));
  },
);

export default http;
