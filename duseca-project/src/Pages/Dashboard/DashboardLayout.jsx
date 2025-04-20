import React from 'react';
import Sidebar from '../../components/admin/Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
// import ManagerDashboard from './ManagerDashboard';
// import UserDashboard from './UserDashboard';

const DashboardLayout = () => {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col bg-gray-100">
                <header className="bg-white shadow px-6 py-4 text-xl font-semibold">
                    Dashboard
                </header>
                <main className="p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
