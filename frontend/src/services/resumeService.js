import api from './api';

const API_PREFIX = ''; // The base URL is already set in api.js

export const resumeAPI = {
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    
    try {
      const response = await api.post(`${API_PREFIX}/resumes`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return {
        success: true,
        ...response.data,
      };
    } catch (error) {
      console.error('Upload failed:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to upload resume',
      };
    }
  },

  getResumes: async () => {
    try {
      const response = await api.get(`${API_PREFIX}/resumes`);
      return {
        success: true,
        data: response.data?.data || [],
      };
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch resumes',
        data: [],
      };
    }
  },

  deleteResume: async (resumeId) => {
    try {
      await api.delete(`${API_PREFIX}/resumes/${resumeId}`);
      return { success: true };
    } catch (error) {
      console.error('Failed to delete resume:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete resume',
      };
    }
  },

  downloadResume: async (resumeId, fileName) => {
    try {
      const response = await api.get(`${API_PREFIX}/resumes/download/${resumeId}`, {
        responseType: 'blob',
      });
      
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return { success: true };
    } catch (error) {
      console.error('Download failed:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to download resume',
      };
    }
  },
};
