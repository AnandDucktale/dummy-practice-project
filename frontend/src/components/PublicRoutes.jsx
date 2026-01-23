import { Navigate, Outlet } from 'react-router-dom';

import useAuthStore from '../hooks/store/useAuthStore';

const PublicRoutes = () => {
  const { user, accessToken, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading session...</p>
      </div>
    );
  }

  if (user && accessToken) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoutes;
