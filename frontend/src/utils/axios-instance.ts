import axios from "axios";
import { apiURL } from "./apiURL";

const axiosInstance = axios.create({
  baseURL: `${apiURL}`,
  withCredentials: true, // Send cookies to the server
});

const refreshToken = async () => {
  const response = await axios.post(
    `${apiURL}/auth/refresh-token`,
    {},
    {
      withCredentials: true,
    }
  );
  return response.data.accessToken;
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

let refreshPromise: Promise<void> | null = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (refreshPromise) {
          await refreshPromise;
          return axiosInstance(originalRequest);
        }

        refreshPromise = refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
