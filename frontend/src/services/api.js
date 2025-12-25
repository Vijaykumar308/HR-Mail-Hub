import axios from 'axios';

// Use Vite environment variable or default to common development port
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies, authorization headers with HTTPS
  timeout: 30000, // Request timeout (30 seconds for SMTP verification)
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle CORS errors
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout. Please check your internet connection.');
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network Error: Please check your internet connection');
      return Promise.reject({ message: 'Network Error: Please check your internet connection' });
    }

    // Handle specific status codes
    const { status, data } = error.response;

    if (status === 401) {
      // Handle unauthorized access
      const requestUrl = error.config?.url || '';
      const message = (data?.message || '').toLowerCase();
      const isEmailSendRequest =
        requestUrl.includes('/api/users/send-email') ||
        requestUrl.includes('/api/users/send-bulk-email');

      const shouldForceLogout =
        !isEmailSendRequest &&
        (requestUrl.includes('/auth/me') ||
          requestUrl.includes('/auth/refresh') ||
          message.includes('jwt') ||
          message.includes('token') ||
          message.includes('not logged in'));

      if (shouldForceLogout) {
        console.error('Unauthorized access. Please log in again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        console.error('Unauthorized request (401).');
      }
    } else if (status === 403) {
      console.error('Forbidden: You do not have permission to access this resource');
    } else if (status === 404) {
      console.error('The requested resource was not found');
    } else if (status >= 500) {
      console.error('Server error. Please try again later.');
    }

    // Return error message from server or default message
    return Promise.reject({
      message: data?.message || 'An error occurred. Please try again.',
      status,
      data: data || {}
    });
  }
);

export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return { success: true, ...response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed. Please try again.'
      };
    }
  },

  signup: async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Signup failed. Please try again.';
    }
  },

  getMe: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch user data';
    }
  },

  updatePassword: async (passwordData) => {
    try {
      const response = await api.patch('/auth/updatePassword', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update password';
    }
  },
};

export const templatesAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/templates');
      return response.data.data.templates;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch templates';
    }
  },

  create: async (templateData) => {
    try {
      const response = await api.post('/templates', templateData);
      return response.data.data.template;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create template';
    }
  },

  update: async (id, templateData) => {
    try {
      const response = await api.patch(`/templates/${id}`, templateData);
      return response.data.data.template;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update template';
    }
  },

  delete: async (id) => {
    try {
      await api.delete(`/templates/${id}`);
      return true;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete template';
    }
  },
};

export default api;
