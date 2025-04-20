// utils/api.js
import axios from 'axios';
import { toast } from 'react-toastify';

const apiInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// ✅ RESPONSE INTERCEPTORS
apiInstance.interceptors.response.use(
    (response) => {
        const message = response.data?.message;
        if (message) toast.success(message);
        return response;
    },
    (error) => {
        const message =
            error.response?.data?.message || error.message || 'Something went wrong!';
        toast.error(message);
        return Promise.reject(error);
    }
);

// ✅ REQUEST INTERCEPTOR – Attach Bearer token
apiInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ CREATE TASK API
export const createTask = async (taskData) => {
    const response = await apiInstance.post('/api/tasks/create-task', {
        ...taskData,
        status: 'pending', // Enforce 'pending' status
    });
    return response.data;
};

export const loginUser = async (email, password, role) => {
    const response = await apiInstance.post('/api/auth/login', {
        email,
        password,
        role,
    });
    return response.data;
};

export const registerUser = async (userData) => {
    const response = await apiInstance.post('/api/users/register', userData);
    return response.data;
};


export const getAllTasks = async () => {
    const response = await apiInstance.get('/api/tasks');
    return response.data;
};

export const getAllUsers = async () => {
    const response = await apiInstance.get("/api/users/all-users");
    return response.data;
};

export const getAllManagers = async () => {
    const response = await apiInstance.get("/api/users/admin/get-all-managers");
    return response.data;
};


export const deleteTask = async (id) => {
    const response = await apiInstance.post(`/api/tasks/delete-task/${id}`);
    return response.data;
};

// http://localhost:5000/api/users/task-status/680532bcfbc6b1ce045d5094
export const taskStatusUpdate = async (id, status) => {
    const response = await apiInstance.post(`/api/users/task-status/${id}`,
        {
            status: status,
        }
    );
    return response.data;
};

// localhost:5000/api/admin/assign
export const AssignManagerToUser = async (payload) => {
    const response = await apiInstance.post(`/api/users/admin/assign-user`, payload);
    return response.data;
};

export default apiInstance;
