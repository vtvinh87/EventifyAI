import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Button } from '../ui/Button';
import { IconMenu } from '../Icons';
import { useAuthStore } from '../../stores/authStore';

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuthStore();
  
  return (
    <div className="flex min-h-[calc(100vh-65px)]">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col">
        {/* Mobile Header for Dashboard */}
        <div className="md:hidden sticky top-0 z-30 flex items-center justify-between p-2 border-b border-white/10 bg-gray-900/50 backdrop-blur-lg">
           <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(true)} className="!p-2">
                <IconMenu size={24} />
           </Button>
           <Link to="/dashboard" className="text-lg font-bold text-white">Dashboard</Link>
           <Link to="/">
             <img src={user?.avatarUrl} alt="User Avatar" className="w-8 h-8 rounded-full" />
           </Link>
        </div>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;