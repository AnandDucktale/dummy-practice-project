import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import defaultAvatar from './assets/defaultAvatar1.jpg';
import router from './router/routes.jsx';
import useAuthStore from './hooks/store/useAuthStore.jsx';
import {
  connectSocket,
  createSocket,
  disconnectSocket,
  getSocket,
} from './api/socket.js';

const App = () => {
  const { accessToken } = useAuthStore();

  const google_client_id = import.meta.env.GOOGLE_CLIENT_ID;

  const newDocNotificationHandler = ({ senderInfo, documentCount }) => {
    toast(
      <CustomDocNotification
        senderInfo={senderInfo}
        documentCount={documentCount}
      />,
      {
        position: 'top-center',
        progress: undefined,
        hideProgressBar: false,
        autoClose: 3000,
        closeButton: true,
        style: {
          padding: '0px',
          width: 'fit-content',
        },
      },
    );
  };

  useEffect(() => {
    createSocket();

    if (accessToken) {
      connectSocket();
      getSocket().on('document:notification:new', newDocNotificationHandler);
    } else {
      getSocket().off('document:notification:new', newDocNotificationHandler);
      disconnectSocket();
    }

    return () => {
      getSocket().off('document:notification:new', newDocNotificationHandler);
      disconnectSocket();
    };
  }, [accessToken]);

  const CustomDocNotification = ({ senderInfo, documentCount }) => {
    return (
      <div className="relative flex gap-4 bg-slate-800 px-6 py-3 rounded-xl shadow-xl overflow-visible">
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 h-20 w-20 rounded-full bg-slate-700 ring-4 ring-slate-800 z-50">
          <img
            src={senderInfo.avatar || defaultAvatar}
            className="h-full w-full rounded-full object-cover"
          />
        </div>

        <div className="pl-10">
          <p className="text-white font-semibold">
            {senderInfo.firstName} {senderInfo.lastName}
          </p>
          <p className="text-sm text-zinc-400">
            {senderInfo.firstName} uploaded{' '}
            {documentCount === 1
              ? 'a new document'
              : `${documentCount} new documents`}
          </p>
        </div>
      </div>
    );
  };

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
