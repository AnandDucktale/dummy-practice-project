import { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import useAuthStore from '../hooks/store/useAuthStore';

const Layout = () => {
  const { appInitialize } = useAuthStore();

  useEffect(() => {
    (async () => {
      await appInitialize();
      // console.log('Layout');
    })();
  }, []);

  return <Outlet />;
};

export default Layout;
