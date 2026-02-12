import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import router from './router/routes.jsx';
import useAuthStore from './hooks/store/useAuthStore.jsx';
import {
  connectSocket,
  createSocket,
  disconnectSocket,
  getSocket,
} from './api/socket.js';
import { newDocNotificationHandler } from './hooks/socket-events/groupEvents.jsx';

const App = () => {
  const { accessToken } = useAuthStore();

  const google_client_id = import.meta.env.GOOGLE_CLIENT_ID;

  useEffect(() => {
    createSocket();

    if (accessToken) {
      connectSocket();
      getSocket().on('message:notification:new', newDocNotificationHandler);
    } else {
      getSocket().off('message:notification:new', newDocNotificationHandler);
      disconnectSocket();
    }

    return () => {
      getSocket().off('message:notification:new', newDocNotificationHandler);
      disconnectSocket();
    };
  }, [accessToken]);

  return (
    <GoogleOAuthProvider clientId={google_client_id}>
      <ToastContainer
        position="top-center"
        newestOnTop
        closeButton={true}
        hideProgressBar={false}
        toastClassName="bg-white/5 shadow-none p-0 override-visible"
        bodyClassName="p-0 m-0"
      />

      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  );
};

export default App;
