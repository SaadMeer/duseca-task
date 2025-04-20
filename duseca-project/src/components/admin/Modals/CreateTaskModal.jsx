import React, { useState, useRef, useEffect } from 'react';
import { createTask } from '../../../utils/api';
import { toast } from 'react-toastify';

const CreateTaskModal = ({ onClose }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignedTo: '',
  });
  const [loading, setLoading] = useState(false);

  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleChange = (e) => {
    setTaskData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTask({ ...taskData, status: 'pending' });
      toast.success('Task created successfully');
      fetchTasks()
      onClose();
    } catch (err) {
      // Global toast handler catches error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000000ad] flex justify-center items-center z-50">
      <div ref={modalRef} className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <h3 className="text-xl font-bold mb-4">Create Task</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Task Title"
            required
            value={taskData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-200 text-black"
          />
          <textarea
            name="description"
            placeholder="Description"
            required
            value={taskData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-200 text-black"
          />
          <input
            type="date"
            name="dueDate"
            required
            value={taskData.dueDate}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-200 text-black"
          />
          <input
            type="email"
            name="assignedTo"
            placeholder="Assign to (Email)"
            required
            value={taskData.assignedTo}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-200 text-black"
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-400 hover:bg-gray-500 text-white"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded text-white ${
                loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
