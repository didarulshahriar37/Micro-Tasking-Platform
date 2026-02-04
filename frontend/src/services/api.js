import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Auth services
export const authService = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/me'),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

// Task services
export const taskService = {
    getAllTasks: (params) => api.get('/tasks', { params }),
    getTask: (id) => api.get(`/tasks/${id}`),
    createTask: (data) => api.post('/tasks', data),
    updateTask: (id, data) => api.patch(`/tasks/${id}`, data),
    deleteTask: (id) => api.delete(`/tasks/${id}`),
    getMyTasks: () => api.get('/tasks/buyer/my-tasks')
};

// Submission services
export const submissionService = {
    getAllSubmissions: () => api.get('/submissions'),
    submitTask: (data) => api.post('/submissions', data),
    reviewSubmission: (id, data) => api.patch(`/submissions/${id}/review`, data)
};

// Transaction services
export const transactionService = {
    getTransactions: (params) => api.get('/transactions', { params }),
    purchaseCoins: (amount) => api.post('/transactions/purchase', { amount }),
    withdrawCoins: (amount) => api.post('/transactions/withdraw', { amount })
};

// User services
export const userService = {
    getAllUsers: (params) => api.get('/users', { params }),
    getStats: () => api.get('/users/stats'),
    toggleUserStatus: (id) => api.patch(`/users/${id}/toggle-status`),
    getNotifications: (params) => api.get('/users/notifications', { params }),
    markNotificationRead: (id) => api.patch(`/users/notifications/${id}/read`),
    markAllNotificationsRead: () => api.patch('/users/notifications/read-all')
};

export default api;
