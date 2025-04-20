import React, { useState, useRef, useEffect } from 'react';
// import { toast } from 'react-toastify';
import { registerUser } from '../../../utils/api';
import { toast } from 'react-toastify';

const CreateUserModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

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
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();
  
    try {
      await registerUser(formData);
      toast.success('User created successfully!');
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create user';
      toast.error(errorMsg);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-[#000000ad] flex justify-center items-center z-50">
      <div ref={modalRef} className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <h3 className="text-xl font-bold mb-4">Create User</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-200 text-black"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-200 text-black"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-200 text-black"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-200 text-black"
          >
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-400 hover:bg-gray-500 text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
