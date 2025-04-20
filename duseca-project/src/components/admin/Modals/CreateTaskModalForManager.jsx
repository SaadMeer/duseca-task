import React, { useState } from 'react';
import { createTask } from '../../../utils/api'; // Your API handler
import { toast } from 'react-toastify';

const CreateTaskModalForManager = ({ onClose, managerId }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    dueDate: '',
  });

  const handleChange = (e) => {
    setTaskData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    const payload = {
      ...taskData,
      createdBy: managerId, // This ensures the task is linked to the manager
    };

    try {
      await createTask(payload);
      toast.success("Task created successfully!");
      onClose();
    } catch (err) {
      toast.error("Failed to create task");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000000ad] bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Create Task</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            required
            value={taskData.title}
            onChange={handleChange}
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
            required
            value={taskData.dueDate}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-100 rounded"
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModalForManager;
