import React from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { taskStatusUpdate } from '../../../utils/api';

const ManagerShowTaskTable = ({ tasks, onDeleteTask, onStatusChange, fetchTasks }) => {
    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await taskStatusUpdate(taskId, newStatus);
            //   toast.success('Task status updated!');
            fetchTasks()
            onStatusChange(); // Refresh the task list
        } catch (error) {
            console.error('Status update failed:', error);
            //   toast.error('Failed to update task status');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6 mt-5">
            <h3 className="text-xl font-semibold mb-4">Your Tasks</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-100 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3">Description</th>
                            <th className="px-6 py-3">Due Date</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => (
                            <tr key={task._id} className="border-b hover:bg-gray-50">
                                <td className="px-6 py-4">{task.assignedToName || 'N/A'}</td>
                                <td className="px-6 py-4">{task.title}</td>
                                <td className="px-6 py-4">{task.description}</td>
                                <td className="px-6 py-4">
                                    {new Date(task.dueDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <select
                                        value={task.status}
                                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer 
                      ${task.status === 'completed'
                                                ? 'bg-green-100 text-green-600'
                                                : task.status === 'in-progress'
                                                    ? 'bg-blue-100 text-blue-600'
                                                    : 'bg-yellow-100 text-yellow-600'
                                            }`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => onDeleteTask(task._id)}
                                        className="text-red-600 hover:text-red-800 cursor-pointer transition-colors"
                                        title="Delete Task"
                                    >
                                        <FiTrash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManagerShowTaskTable;
