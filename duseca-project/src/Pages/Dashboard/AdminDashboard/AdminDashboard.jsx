import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaTasks } from 'react-icons/fa';
import CreateUserModal from '../../../components/admin/Modals/CreateUserModal';
import CreateTaskModal from '../../../components/admin/Modals/CreateTaskModal';
import DashboardBox from '../../../components/admin/DashboardBox';
import UserTable from '../../../components/admin/Tables/UserTable';
import { deleteTask, getAllTasks } from '../../../utils/api';

const AdminDashboard = () => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dueDateFilter, setDueDateFilter] = useState('');

  const fetchTasks = async () => {
    try {
      const data = await getAllTasks();
      setTasks(data);
      setFilteredTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      await fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  // 🔍 Handle Filtering Logic
  useEffect(() => {
    let filtered = [...tasks];

    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    if (dueDateFilter) {
      filtered = filtered.filter(
        (task) =>
          new Date(task.dueDate).toLocaleDateString() ===
          new Date(dueDateFilter).toLocaleDateString()
      );
    }

    setFilteredTasks(filtered);
  }, [searchTerm, statusFilter, dueDateFilter, tasks]);

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setDueDateFilter('');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <DashboardBox
          icon={<FaUserPlus />}
          title="Create User"
          subtitle="Add managers or regular users"
          onClick={() => setIsUserModalOpen(true)}
          iconColor="text-blue-600"
        />
        <DashboardBox
          icon={<FaTasks />}
          title="Create Task"
          subtitle="Assign tasks to users"
          onClick={() => setIsTaskModalOpen(true)}
          iconColor="text-green-600"
        />
      </div>

      {/* 🔽 Filters */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:gap-4 gap-4">
        <input
          type="text"
          placeholder="Search by title or description..."
          className="p-2 rounded border w-full md:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-2 rounded border w-full md:w-1/4"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <input
          type="date"
          className="p-2 rounded border w-full md:w-1/4"
          value={dueDateFilter}
          onChange={(e) => setDueDateFilter(e.target.value)}
        />
        <button
          onClick={resetFilters}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>

      <UserTable tasks={filteredTasks} onDeleteTask={handleDeleteTask} />

      {isUserModalOpen && <CreateUserModal onClose={() => setIsUserModalOpen(false)} />}
      {isTaskModalOpen && <CreateTaskModal onClose={() => setIsTaskModalOpen(false)} fetchTasks={fetchTasks} />}
    </div>
  );
};

export default AdminDashboard;
