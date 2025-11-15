import api from './api';

const API_PREFIX = '/resumes'; // Base path for resume endpoints

export const resumeAPI = {
  /**
   * Upload a new resume
   * @param {File} file - The resume file to upload
   * @param {Function} onUploadProgress - Callback to track upload progress
   * @returns {Promise<Object>} - Upload result with success status and data/error
   */
  uploadResume: async (file, onUploadProgress = null) => {
    const formData = new FormData();
    formData.append('resume', file);
    
    try {
      const response = await api.post(API_PREFIX, formData, {
        // Remove Content-Type header to let browser set it correctly for FormData
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: onUploadProgress ? (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(percentCompleted);
        } : null,
      });
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Upload failed:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to upload resume',
        validationErrors: error.response?.data?.errors,
      };
    }
  },

  /**
   * Get list of all resumes for the current user
   * @returns {Promise<Object>} - List of resumes or error
   */
  getResumes: async () => {
    try {
      const response = await api.get(API_PREFIX);
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

  /**
   * Delete a resume
   * @param {string} resumeId - ID of the resume to delete
   * @returns {Promise<Object>} - Success status and optional error message
   */
  deleteResume: async (resumeId) => {
    try {
      await api.delete(`${API_PREFIX}/${resumeId}`);
      return { success: true };
    } catch (error) {
      console.error('Failed to delete resume:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete resume',
      };
    }
  },

  /**
   * Set a resume as active
   * @param {string} resumeId - ID of the resume to set as active
   * @returns {Promise<Object>} - Success status and optional error message
   */
  setActiveResume: async (resumeId) => {
    try {
      await api.patch(`${API_PREFIX}/${resumeId}/set-active`);
      return { success: true };
    } catch (error) {
      console.error('Failed to set active resume:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to set active resume',
      };
    }
  },

  /**
   * Download a resume file
   * @param {string} resumeId - ID of the resume to download
   * @param {string} fileName - Desired filename for the downloaded file
   * @returns {Promise<Object>} - Success status and optional error message
   */
  downloadResume: async (resumeId, fileName) => {
    try {
      const response = await api.get(`${API_PREFIX}/${resumeId}/download`, {
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
      
      // Clean up the URL object
      window.URL.revokeObjectURL(url);
      
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