import api from './api';

const hrDirectoryService = {
  // Get all HR contacts with optional filtering
  async getAllHRContacts(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.industry) params.append('industry', filters.industry);
    if (filters.location) params.append('location', filters.location);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await api.get(`/hr-directory?${params}`);
    return response.data;
  },

  // Get single HR contact by ID
  async getHRContactById(id) {
    const response = await api.get(`/hr-directory/${id}`);
    return response.data;
  },

  // Create new HR contact
  async createHRContact(hrData) {
    const response = await api.post('/hr-directory', hrData);
    return response.data;
  },

  // Update HR contact
  async updateHRContact(id, hrData) {
    const response = await api.patch(`/hr-directory/${id}`, hrData);
    return response.data;
  },

  // Delete HR contact
  async deleteHRContact(id) {
    const response = await api.delete(`/hr-directory/${id}`);
    return response.data;
  },

  // Get HR directory statistics
  async getHRStats() {
    const response = await api.get('/hr-directory/stats');
    return response.data;
  },

  // Increment resumes shared count
  async incrementResumesShared(id) {
    const response = await api.patch(`/hr-directory/${id}/increment-resumes`);
    return response.data;
  }
};

export default hrDirectoryService;
