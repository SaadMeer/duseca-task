import React, { useEffect, useState } from 'react';
import { FaTasks } from 'react-icons/fa';
import ManagerDashboardBox from './ManagerDashboardBox';
import CreateTaskModalForManager from '../../../components/admin/Modals/CreateTaskModalForManager';
import { deleteTask, getAllTasks } from '../../../utils/api';
import ManagerShowTaskTable from '../../../components/admin/Tables/ManagerShowTaskTable';

const ManagerDashboard = ({ managerId }) => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const allTasks = await getAllTasks();
      const filtered = allTasks.filter(task => task.createdBy === managerId);
      setTasks(filtered);
    } catch (err) {
      console.error('Failed to fetch manager tasks:', err);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      fetchTasks(); // refresh
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);


  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manager Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ManagerDashboardBox
          icon={<FaTasks />}
          title="Create Task"
          subtitle="Add your own task"
          onClick={() => setIsTaskModalOpen(true)}
          iconColor="text-green-600"
        />
        {/* Add more boxes if needed */}
      </div>

      <ManagerShowTaskTable tasks={tasks} onDeleteTask={handleDelete} fetchTasks={fetchTasks} />


      {isTaskModalOpen && (
        <CreateTaskModalForManager
          managerId={managerId}
          onClose={() => setIsTaskModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ManagerDashboard;
