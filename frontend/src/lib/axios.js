import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // by adding this field browser will send the cookies to server automatically, on every single req
});

// Add Clerk authentication token to every request
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Get token from Clerk
      const token = await window.Clerk?.session?.getToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      console.error('❌ Error getting Clerk token:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;

