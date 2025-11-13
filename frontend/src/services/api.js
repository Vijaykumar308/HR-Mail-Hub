import axios from 'axios';

// Use Vite environment variable or default to common development port
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies, authorization headers with HTTPS
  timeout: 10000, // Request timeout
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
      console.error('Unauthorized access. Please log in again.');
      localStorage.removeItem('token');
      window.location.href = '/login';
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
};

export default api;
