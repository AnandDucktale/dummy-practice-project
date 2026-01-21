import axios from 'axios';
import useAuthStore from '../hooks/store/useAuthStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    // console.log(config);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Original Request configuration
    const originalRequest = error?.config;

    // console.log(originalRequest);

    const { refreshAccessToken, clearAuth } = useAuthStore.getState();

    if (error?.response?.status === 401 && !originalRequest._retry) {
      try {
        originalRequest._retry = true;
        const newAccessToken = await refreshAccessToken();

        if (!newAccessToken) {
          clearAuth();
          return Promise.reject(error);
        }
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (error) {
        console.error('Token refresh failed', error);
        clearAuth();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
