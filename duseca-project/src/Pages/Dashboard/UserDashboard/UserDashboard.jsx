import React, { useEffect, useState } from 'react';
import { FaTasks } from 'react-icons/fa';
import { deleteTask, getAllTasks } from '../../../utils/api';
import CreateTaskModalForUser from '../../../components/admin/Modals/CreateTaskModalForUser';
import UserShowTaskTable from '../../../components/admin/Tables/UserShowTaskTable';

const UserDashboard = ({ userId }) => {
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [tasks, setTasks] = useState([]);

    const fetchTasks = async () => {
        try {
            const allTasks = await getAllTasks();
            const filtered = allTasks.filter(task => task.createdBy === userId);
            setTasks(filtered);
        } catch (err) {
            console.error('Failed to fetch user tasks:', err);
        }
    };

    const handleDelete = async (taskId) => {
        try {
            await deleteTask(taskId);
            fetchTasks();
        } catch (err) {
            console.error('Failed to delete task:', err);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">User Dashboard</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                    className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:bg-gray-100"
                    onClick={() => setIsTaskModalOpen(true)}
                >
                    <div className="flex items-center space-x-4">
                        <FaTasks className="text-blue-600 text-2xl" />
                        <div>
                            <h4 className="font-semibold">Create Task</h4>
                            <p className="text-sm text-gray-500">Add your own task</p>
                        </div>
                    </div>
                </div>
            </div>

            <UserShowTaskTable tasks={tasks} onDeleteTask={handleDelete} fetchTasks={fetchTasks} />

            {isTaskModalOpen && (
                <CreateTaskModalForUser
                    userId={userId}
                    onClose={() => setIsTaskModalOpen(false)}
                    fetchTasks={fetchTasks}
                />
            )}
        </div>
    );
};

export default UserDashboard;
