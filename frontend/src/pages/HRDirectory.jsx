import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../components/Pagination';

const HRDirectory = () => {
  const navigate = useNavigate();
  const [selectedHRs, setSelectedHRs] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // Sample HR data with Indian companies and female HRs
  const [hrContacts, setHrContacts] = useState([
    {
      id: 1,
      company: 'TCS',
      name: 'Priya Sharma',
      email: 'priya.sharma@tcs.com',
      industry: 'IT Services',
      location: 'Mumbai, India',
      lastContacted: '2023-11-10',
      resumesShared: 3,
      status: 'active'
    },
    {
      id: 2,
      company: 'Infosys',
      name: 'Ananya Patel',
      email: 'ananya.p@infosys.com',
      industry: 'Technology',
      location: 'Bengaluru, India',
      lastContacted: '2023-11-08',
      status: 'active'
    },
    {
      id: 3,
      company: 'Wipro',
      name: 'Meera Reddy',
      email: 'meera.reddy@wipro.com',
      industry: 'IT Services',
      location: 'Pune, India',
      lastContacted: '2023-11-05',
      status: 'pending'
    },
    {
      id: 4,
      company: 'HCL Technologies',
      name: 'Kavita Verma',
      email: 'kavita.v@hcl.com',
      industry: 'Technology',
      location: 'Noida, India',
      lastContacted: '2023-11-12',
      status: 'active'
    },
    {
      id: 5,
      company: 'Tech Mahindra',
      name: 'Divya Iyer',
      email: 'divya.iyer@techmahindra.com',
      industry: 'IT Services',
      location: 'Hyderabad, India',
      lastContacted: '2023-11-01',
      status: 'active'
    },
    {
      id: 6,
      company: 'Accenture India',
      name: 'Neha Kapoor',
      email: 'neha.kapoor@accenture.com',
      industry: 'Consulting',
      location: 'Gurugram, India',
      lastContacted: '2023-10-28',
      status: 'inactive'
    },
    {
      id: 7,
      company: 'HDFC Bank',
      name: 'Shreya Menon',
      email: 'shreya.m@hdfcbank.com',
      industry: 'Banking',
      location: 'Mumbai, India',
      lastContacted: '2023-11-15',
      status: 'active'
    },
    {
      id: 8,
      company: 'ICICI Bank',
      name: 'Aishwarya Nair',
      email: 'aishwarya.n@icicibank.com',
      industry: 'Banking',
      location: 'Mumbai, India',
      lastContacted: '2023-11-14',
      status: 'active'
    },
    {
      id: 9,
      company: 'Flipkart',
      name: 'Aditi Joshi',
      email: 'aditi.joshi@flipkart.com',
      industry: 'E-commerce',
      location: 'Bengaluru, India',
      lastContacted: '2023-11-09',
      status: 'active'
    },
    {
      id: 10,
      company: 'Zomato',
      name: 'Pooja Gupta',
      email: 'pooja.g@zomato.com',
      industry: 'Food Tech',
      location: 'Gurugram, India',
      lastContacted: '2023-10-25',
      status: 'pending'
    },
    {
      id: 11,
      company: 'Byju\'s',
      name: 'Riya Malhotra',
      email: 'riya.m@byjus.com',
      industry: 'EdTech',
      location: 'Bengaluru, India',
      lastContacted: '2023-11-02',
      status: 'active'
    },
    {
      id: 12,
      company: 'Airtel',
      name: 'Anjali Deshpande',
      email: 'anjali.d@airtel.in',
      industry: 'Telecom',
      location: 'New Delhi, India',
      lastContacted: '2023-10-30',
      status: 'active'
    },
    {
      id: 13,
      company: 'Reliance Jio',
      name: 'Kiran Nair',
      email: 'kiran.n@jio.com',
      industry: 'Telecom',
      location: 'Mumbai, India',
      lastContacted: '2023-11-13',
      status: 'active'
    },
    {
      id: 14,
      company: 'Mahindra & Mahindra',
      name: 'Shweta Rao',
      email: 'shweta.rao@mahindra.com',
      industry: 'Automobile',
      location: 'Mumbai, India',
      lastContacted: '2023-10-22',
      status: 'inactive'
    },
    {
      id: 15,
      company: 'Tata Motors',
      name: 'Nandini Choudhary',
      email: 'nandini.c@tatamotors.com',
      industry: 'Automobile',
      location: 'Pune, India',
      lastContacted: '2023-11-07',
      status: 'active'
    },
    {
      id: 16,
      company: 'Wipro GE Healthcare',
      name: 'Ananya Reddy',
      email: 'ananya.r@wiproge.com',
      industry: 'Healthcare',
      location: 'Bengaluru, India',
      lastContacted: '2023-10-18',
      status: 'active'
    },
    {
      id: 17,
      company: 'Apollo Hospitals',
      name: 'Megha Srinivasan',
      email: 'megha.s@apollohospitals.com',
      industry: 'Healthcare',
      location: 'Chennai, India',
      lastContacted: '2023-11-03',
      status: 'pending'
    },
    {
      id: 18,
      company: 'Asian Paints',
      name: 'Shalini Kapoor',
      email: 'shalini.k@asianpaints.com',
      industry: 'Manufacturing',
      location: 'Mumbai, India',
      lastContacted: '2023-10-29',
      status: 'active'
    },
    {
      id: 19,
      company: 'ITC Limited',
      name: 'Rashmi Iyer',
      email: 'rashmi.iyer@itc.in',
      industry: 'FMCG',
      location: 'Kolkata, India',
      lastContacted: '2023-11-06',
      status: 'active'
    },
    {
      id: 20,
      company: 'Larsen & Toubro',
      name: 'Anita Desai',
      email: 'anita.desai@larsentoubro.com',
      industry: 'Construction',
      location: 'Mumbai, India',
      lastContacted: '2023-10-20',
      status: 'active'
    }
  ]);

  const [filters, setFilters] = useState({
    industry: '',
    location: '',
    status: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page

  const industries = [...new Set(hrContacts.map(hr => hr.industry))];
  const locations = [...new Set(hrContacts.map(hr => hr.location))];
  const statuses = ['active', 'pending', 'inactive'];

  // Filter HRs based on selected filters
  const filteredHRs = useMemo(() => {
    const filtered = hrContacts.filter(hr => {
      return (
        (filters.industry === '' || hr.industry === filters.industry) &&
        (filters.location === '' || hr.location === filters.location) &&
        (filters.status === '' || hr.status === filters.status)
      );
    });
    
    // Reset to first page when filters change
    setCurrentPage(1);
    return filtered;
  }, [hrContacts, filters.industry, filters.location, filters.status]);

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHRs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHRs.length / itemsPerPage);

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
    if (currentItems.length > 0) {
      const allCurrentPageSelected = currentItems.every(item => 
        selectedHRs.includes(item.id)
      );
      setSelectAll(allCurrentPageSelected);
    } else {
      setSelectAll(false);
    }
  }, [currentPage, selectedHRs, currentItems]);

  const handleSelectAll = () => {
    const currentPageIds = currentItems.map(item => item.id);
    
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


  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">HR Directory</h2>
        <div className="mt-4 sm:mt-0 flex space-x-3">
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((hr) => (
                    <tr key={hr.id} className={selectedHRs.includes(hr.id) ? 'bg-gray-50' : 'hover:bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedHRs.includes(hr.id)}
                          onChange={() => handleSelectHR(hr.id)}
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
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={paginate}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default HRDirectory;
