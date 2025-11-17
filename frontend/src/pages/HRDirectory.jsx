import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Pagination from '../components/Pagination';
import EmailModal from '../components/EmailModal';
import emailService from '../services/emailService';
import hrDirectoryService from '../services/hrDirectoryService';

const HRDirectory = () => {
  const navigate = useNavigate();
  const [selectedHRs, setSelectedHRs] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [isEmailSending, setIsEmailSending] = useState(false);
  
  // Database state
  const [hrContacts, setHrContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    industry: '',
    location: '',
    status: ''
  });

  const itemsPerPage = 10;

  // Load HR contacts from database
  const loadHRContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await hrDirectoryService.getAllHRContacts({
        ...filters,
        page: currentPage,
        limit: itemsPerPage
      });
      
      console.log('API Response:', response);
      console.log('hrContacts from response:', response.data.hrContacts);
      
      setHrContacts(response.data.hrContacts);
      setTotal(response.data.total);
      setPages(response.data.pages);
    } catch (err) {
      console.error('Error loading HR contacts:', err);
      setError('Failed to load HR contacts. Please try again.');
      setHrContacts([]);
      setTotal(0);
      setPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHRContacts();
  }, [currentPage, filters]);

  const industries = hrContacts ? [...new Set(hrContacts.map(hr => hr.industry))] : [];
  const locations = hrContacts ? [...new Set(hrContacts.map(hr => hr.location))] : [];
  const statuses = ['active', 'pending', 'inactive'];

  // CRUD handlers
  const handleEditHR = (hr) => {
    // Navigate to edit page (we'll need to create this route)
    navigate(`/hr-directory/edit/${hr._id}`);
  };

  const handleDeleteHR = async (hr) => {
    if (window.confirm(`Are you sure you want to delete ${hr.name} from ${hr.company}?`)) {
      try {
        await hrDirectoryService.deleteHRContact(hr._id);
        loadHRContacts(); // Reload the data
      } catch (error) {
        console.error('Error deleting HR contact:', error);
        toast.error('Failed to delete HR contact. Please try again.');
      }
    }
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSelectHR = (id) => {
    setSelectedHRs(prev => 
      prev.includes(id) 
        ? prev.filter(hrId => hrId !== id)
        : [...prev, id]
    );
  };

  // Update selectAll state based on current page's selection
  useEffect(() => {
    if (hrContacts && hrContacts.length > 0) {
      const allCurrentPageSelected = hrContacts && hrContacts.every(item => 
        selectedHRs.includes(item._id)
      );
      setSelectAll(allCurrentPageSelected);
    } else {
      setSelectAll(false);
    }
  }, [currentPage, selectedHRs, hrContacts]);

  const handleSelectAll = () => {
    const currentPageIds = hrContacts ? hrContacts.map(item => item._id) : [];
    
    if (selectAll) {
      // Deselect all items on the current page
      setSelectedHRs(prev => prev.filter(id => !currentPageIds.includes(id)));
    } else {
      // Select all items on the current page
      setSelectedHRs(prev => [...new Set([...prev, ...currentPageIds])]);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Email handler functions
  const handleSendEmail = (hr) => {
    setSelectedRecipients([{
      id: hr._id,
      name: hr.name,
      email: hr.email,
      company: hr.company
    }]);
    setIsEmailModalOpen(true);
  };

  const handleSendBulkEmail = () => {
    const selectedHRContacts = hrContacts ? hrContacts.filter(hr => selectedHRs.includes(hr._id)) : [];
    setSelectedRecipients(selectedHRContacts.map(hr => ({
      id: hr._id,
      name: hr.name,
      email: hr.email,
      company: hr.company
    })));
    setIsEmailModalOpen(true);
  };

  const handleEmailSubmit = async (emailData) => {
    setIsEmailSending(true);
    try {
      if (selectedRecipients.length === 1) {
        await emailService.sendEmail(emailData);
      } else {
        await emailService.sendBulkEmail(emailData);
      }
      
      // Show success message
      toast.success(`Email sent successfully to ${selectedRecipients.length} recipient(s)!`);
      setIsEmailModalOpen(false);
      setSelectedRecipients([]);
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error(`Failed to send email: ${error.message || 'Unknown error'}`);
    } finally {
      setIsEmailSending(false);
    }
  };

  const handleCloseEmailModal = () => {
    setIsEmailModalOpen(false);
    setSelectedRecipients([]);
  };


  return (
    <>
      <div className="space-y-6 max-w-full overflow-x-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold text-gray-900">HR Directory</h2>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          {selectedHRs.length > 0 && (
            <button
              type="button"
              onClick={handleSendBulkEmail}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Send Email ({selectedHRs.length})
            </button>
          )}
          
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Export
          </button>
          <button 
            onClick={() => navigate('/hr-directory/create')}
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add HR Contact
          </button>
        </div>
      </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
              Industry
            </label>
            <select
              id="industry"
              name="industry"
              value={filters.industry}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="">All Industries</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <select
              id="location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => setFilters({ industry: '', location: '', status: '' })}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* HR Contacts Table */}
      <div className="flex flex-col w-full overflow-x-auto">
        {/* Error State */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-2 text-gray-600">Loading HR contacts...</span>
          </div>
        )}

        {/* Table */}
        {!loading && (
          <div className="inline-block min-w-full py-2 align-middle">
          <div className="overflow-hidden shadow border-b border-gray-200 sm:rounded-lg">
              <div className="bg-white px-4 py-3 border-b border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="select-all"
                      name="select-all"
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="select-all" className="ml-2 text-sm text-gray-900">
                      Select all
                    </label>
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedHRs.length} selected
                  </div>
                </div>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <span className="sr-only">Select</span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      HR Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Industry
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Contacted
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resumes Shared
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {hrContacts && hrContacts.map((hr) => (
                    <tr key={hr._id} className={selectedHRs.includes(hr._id) ? 'bg-gray-50' : 'hover:bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedHRs.includes(hr._id)}
                          onChange={() => handleSelectHR(hr._id)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{hr.company}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{hr.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{hr.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{hr.industry}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{hr.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          hr.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : hr.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {hr.status.charAt(0).toUpperCase() + hr.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{new Date(hr.lastContacted).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">{hr.resumesShared || 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-medium">
                        <button
                          onClick={() => handleSendEmail(hr)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
                        >
                          <svg
                            className="-ml-0.5 mr-1.5 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                          Send Email
                        </button>
                        <button
                          onClick={() => handleEditHR(hr)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mr-2"
                        >
                          <svg
                            className="-ml-0.5 mr-1.5 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteHR(hr)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <svg
                            className="-ml-0.5 mr-1.5 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
              
              {/* Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <Pagination 
                  currentPage={currentPage}
                  totalPages={pages}
                  totalItems={total}
                  onPageChange={paginate}
                />
              </div>
            </div>
          )}
        </div>

      {/* Email Modal */}
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={handleCloseEmailModal}
        recipients={selectedRecipients}
        onSendEmail={handleEmailSubmit}
        isLoading={isEmailSending}
      />

    </>
  );
};

export default HRDirectory;
