import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import './index.css';
import router from './router/routes.jsx';

const google_client_id = import.meta.env.GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={google_client_id}>
    <RouterProvider router={router} />
  </GoogleOAuthProvider>,
);
