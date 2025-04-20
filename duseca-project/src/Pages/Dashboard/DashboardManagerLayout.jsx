import React from 'react'
import { Outlet } from 'react-router-dom'
import ManagerSideBar from '../../components/admin/Sidebar/ManagerSideBar'

const DashboardManagerLayout = () => {
    return (
        <div className="flex h-screen">
            <ManagerSideBar />
            <div className="flex-1 flex flex-col bg-gray-100">
                <header className="bg-white shadow px-6 py-4 text-xl font-semibold">
                    Dashboard
                </header>
                <main className="p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default DashboardManagerLayout