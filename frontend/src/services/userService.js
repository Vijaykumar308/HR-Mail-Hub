import api from './api';

const userService = {
    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    updateMe: async (userData) => {
        const response = await api.patch('/users/updateMe', userData);
        return response.data;
    },

    // Admin methods
    getAllUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },

    createUser: async (userData) => {
        const response = await api.post('/users', userData);
        return response.data;
    },

    updateUser: async (id, userData) => {
        const response = await api.patch(`/users/${id}`, userData);
        return response.data;
    },

    deleteUser: async (id) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    }
};

export default userService;
