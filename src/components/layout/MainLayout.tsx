
import React from 'react';
import GlobalNavigation from '@/components/GlobalNavigation';
import { Outlet } from 'react-router-dom';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden relative">
      {/* App name in top right */}
      <div className="app-logo absolute top-4 right-4 bg-[#0A1A2F]/80 backdrop-blur-md py-2 px-4 rounded-lg shadow-md z-10 border border-[#00FFD1]/30 shadow-[0_0_15px_rgba(0,255,209,0.2)]">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00FFD1] to-blue-300">DeepCAL</h1>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 pb-16">
        {children || <Outlet />}
      </div>
      
      {/* Navigation */}
      <GlobalNavigation />
    </div>
  );
};

export default MainLayout;
