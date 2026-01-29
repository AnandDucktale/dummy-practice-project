import { io } from 'socket.io-client';

import useAuthStore from '../hooks/store/useAuthStore';

let socket;
export const createSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL, {
      autoConnect: false,
    });
  }

  socket.on('connect_error', (err) => {
    console.log(err.message);
  });
  return socket;
};

export const connectSocket = () => {
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) return;

  socket.auth = { token: accessToken };
  socket.connect();
};

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
  }
};

export const getSocket = () => {
  return socket;
};
