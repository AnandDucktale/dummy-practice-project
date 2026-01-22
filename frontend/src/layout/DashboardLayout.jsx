import React from 'react';
import { Outlet } from 'react-router-dom';

import SideBar from '../components/SideBar';
import Header from '../components/Header';

const DashboardLayout = () => {
  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <section className="w-72 shrink-0">
          <SideBar />
        </section>

        {/* Main content */}
        <section className="flex-1 min-w-0 min-h-0 overflow-hidden">
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default DashboardLayout;
