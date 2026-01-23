import axios from 'axios';
import { create } from 'zustand';

import api from '../../api/axios';

const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  loading: true,

  setAuth: (user, accessToken) => set({ user, accessToken }),
  updateUser: (updates) =>
    set((state) => ({
      user: { ...state.user, ...updates },
    })),
  clearAuth: () => set({ user: null, accessToken: null }),

  refreshAccessToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/refreshToken`,
        { refreshToken },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      set({
        accessToken: response.data.accessToken,
      });
      return response.data.accessToken;
    } catch (error) {
      // console.error('Refresh failed', error.response?.data || error.message);
      get().clearAuth();
      return null;
    }
  },

  appInitialize: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');

      const response = await api.post(
        '/user/refreshToken',
        { refreshToken },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      set({
        user: response.data.user,
        accessToken: response.data.accessToken,
        loading: false,
      });
      // console.log('Refresh page and i am from appInitialize', refreshToken);
      // console.log(response);

      return true;
    } catch (error) {
      set({ loading: false });
      console.log('No active session');
      return false;
    }
  },
}));

export default useAuthStore;
