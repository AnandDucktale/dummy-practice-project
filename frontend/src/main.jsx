import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './router/routes.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

const google_client_id = import.meta.env.GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={google_client_id}>
    <RouterProvider router={router} />
  </GoogleOAuthProvider>,
);
