import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (token) config.headers.Authorization = `Bearer ${token}`;

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      if (user?.userId) config.headers["X-User-Id"] = user.userId;
      if (user?.role) config.headers["X-User-Role"] = user.role;
      if (user?.name) config.headers["X-User-Name"] = user.name;
      if (user?.email) config.headers["X-User-Email"] = user.email;
    } catch {
      localStorage.removeItem("user");
    }
  }

  return config;
});

// Global error handling
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
