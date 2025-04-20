import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { createTask } from '../../../utils/api';

const CreateTaskModalForUser = ({ onClose, userId,fetchTasks }) => {
    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        dueDate: '',
    });

    const handleChange = (e) => {
        setTaskData({ ...taskData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        toast.dismiss();

        try {
            await createTask({ ...taskData, createdBy: userId });
            toast.success('Task created successfully!');
            fetchTasks()
            onClose();
        } catch (err) {
            toast.error('Failed to create task');
        }
    };

    return (
        <div className="fixed inset-0 bg-[#000000ba] bg-opacity-50 flex justify-center items-center z-50">
            <ToastContainer/>
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4">Create Task</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={taskData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 bg-gray-100 rounded"
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={taskData.description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-100 rounded"
                    />
                    <input
                        type="date"
                        name="dueDate"
                        value={taskData.dueDate}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 bg-gray-100 rounded"
                    />
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskModalForUser;
