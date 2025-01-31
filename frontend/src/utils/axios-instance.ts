import axios from "axios";
import { apiURL } from "./apiURL";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: `${apiURL}`,
  withCredentials: true, // Send cookies to the server
});

const refreshToken = async () => {
  try {
    const response = await axios.post(
      `${apiURL}/auth/refresh-token`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data.accessToken;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
const logout = async () => {
  try {
    const res = await axiosInstance.get("/auth/logout");
    if (res.status === 200) {
    }
  } catch (error) {
    console.error(error);
  }
};

// Get the refreshToken and logout functions from the AuthContext

let refreshPromise: Promise<void> | null = null; // Explicitly define the type

// Response interceptor to handle token expiration and refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is due to an expired token (401 status) and if the request hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // If a refresh is already in progress, wait for it to complete
        if (refreshPromise) {
          await refreshPromise;
          return axiosInstance(originalRequest);
        }

        // Start a new refresh process
        refreshPromise = refreshToken();
        await refreshPromise;
        refreshPromise = null;

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log the user out and redirect to the login page
        logout();
        return Promise.reject(refreshError);
      }
    }

    // If the error is not related to token expiration, reject the promise
    return Promise.reject(error);
  }
);

export default axiosInstance;
