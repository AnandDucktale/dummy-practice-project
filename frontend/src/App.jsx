import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import router from './router/routes.jsx';
import useAuthStore from './hooks/store/useAuthStore.jsx';
import { connectSocket, createSocket, disconnectSocket } from './api/socket.js';

const App = () => {
  const { accessToken } = useAuthStore();

  const google_client_id = import.meta.env.GOOGLE_CLIENT_ID;

  useEffect(() => {
    createSocket();

    if (accessToken) {
      connectSocket();
    } else {
      disconnectSocket();
    }

    return () => disconnectSocket();
  }, [accessToken]);
  return (
    <GoogleOAuthProvider clientId={google_client_id}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  );
};

export default App;
