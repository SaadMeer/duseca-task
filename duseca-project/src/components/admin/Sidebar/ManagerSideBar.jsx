import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiGrid, FiCheckSquare } from 'react-icons/fi';

const ManagerSideBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-6">Task Manager</h2>
        <ul className="space-y-2">
          <Link to="/dashboard-manager">
            <li className="flex items-center gap-2 hover:bg-gray-700 rounded px-3 py-2 transition-colors duration-200 cursor-pointer">
              <FiGrid />
              <span>Dashboard</span>
            </li>
          </Link>
          <Link to="/dashboard-manager/usertasks">
            <li className="flex items-center gap-2 hover:bg-gray-700 rounded px-3 py-2 transition-colors duration-200 cursor-pointer">
              <FiCheckSquare />
              <span>Tasks</span>
            </li>
          </Link>
        </ul>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 hover:bg-gray-700 rounded px-3 py-2 transition-colors duration-200"
      >
        <FiLogOut className="text-lg" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default ManagerSideBar;
