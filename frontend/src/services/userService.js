import api from './api';

const userService = {
    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    updateMe: async (userData) => {
        const response = await api.patch('/users/updateMe', userData);
        return response.data;
    }
};

export default userService;
