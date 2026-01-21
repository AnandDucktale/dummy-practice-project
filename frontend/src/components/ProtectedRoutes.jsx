import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../hooks/store/useAuthStore';

const ProtectedRoutes = () => {
  const { user, accessToken, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="animate-spin border-4 border-t-4 border-r-4 border-b-4 border-fuchsia-200 border-t-fuchsia-700 border-r-fuchsia-700 border-b-fuchsia-700 rounded-full w-12 h-12"></div>
      </div>
    );
  }

  // console.log(user);
  // console.log(accessToken);

  if (!user || !accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
export default ProtectedRoutes;
