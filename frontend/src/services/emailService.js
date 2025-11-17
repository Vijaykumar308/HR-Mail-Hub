import api from './api';

const emailService = {
  // Send email to single recipient
  sendEmail: async (emailData) => {
    try {
      const response = await api.post('/users/send-email', emailData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Send bulk email to multiple recipients
  sendBulkEmail: async (emailData) => {
    try {
      const response = await api.post('/users/send-bulk-email', emailData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Send welcome email
  sendWelcomeEmail: async (emailData) => {
    try {
      const response = await api.post('/users/send-welcome-email', emailData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Send password reset email
  sendPasswordResetEmail: async (emailData) => {
    try {
      const response = await api.post('/users/send-password-reset-email', emailData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Send resume submission email
  sendResumeSubmissionEmail: async (emailData) => {
    try {
      const response = await api.post('/users/send-resume-submission-email', emailData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default emailService;
