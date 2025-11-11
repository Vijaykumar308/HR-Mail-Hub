import React, { useState } from 'react';

const SendApplications = () => {
  const [selectedResume, setSelectedResume] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedHRs, setSelectedHRs] = useState([1, 3]); // Sample selected HRs
  
  // Sample data
  const resumes = [
    { id: '1', name: 'Software_Engineer_Resume.pdf' },
    { id: '2', name: 'Frontend_Developer_Resume.pdf' },
  ];
  
  const templates = [
    { id: '1', name: 'Software Engineer Application' },
    { id: '2', name: 'Frontend Developer Application' },
  ];
  
  const hrContacts = [
    { id: 1, name: 'Sarah Johnson', company: 'Google', email: 'sarah.j@google.com' },
    { id: 2, name: 'Michael Chen', company: 'Microsoft', email: 'michael.c@microsoft.com' },
    { id: 3, name: 'David Kim', company: 'Amazon', email: 'david.k@amazon.com' },
  ];

  const handleSendApplications = () => {
    // Implementation for sending applications
    alert('Applications sent successfully!');
  };

  const toggleHRSelection = (id) => {
    setSelectedHRs(prev => 
      prev.includes(id) 
        ? prev.filter(hrId => hrId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Send Applications</h2>
        <p className="mt-1 text-sm text-gray-500">
          Select a resume, template, and HR contacts to send your applications
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Application Details</h3>
        </div>
        
        <div className="px-4 py-5 sm:p-6 space-y-6">
          {/* Resume Selection */}
          <div>
            <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
              Select Resume
            </label>
            <select
              id="resume"
              name="resume"
              value={selectedResume}
              onChange={(e) => setSelectedResume(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="">Select a resume</option>
              {resumes.map(resume => (
                <option key={resume.id} value={resume.id}>
                  {resume.name}
                </option>
              ))}
            </select>
          </div>

          {/* Template Selection */}
          <div>
            <label htmlFor="template" className="block text-sm font-medium text-gray-700">
              Select Email Template
            </label>
            <select
              id="template"
              name="template"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="">Select a template</option>
              {templates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          {/* HR Selection */}
          <div>
            <h4 className="block text-sm font-medium text-gray-700 mb-2">
              Select HR Contacts
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded-md">
              {hrContacts.map(hr => (
                <div key={hr.id} className="flex items-center">
                  <input
                    id={`hr-${hr.id}`}
                    name="hr-contacts"
                    type="checkbox"
                    checked={selectedHRs.includes(hr.id)}
                    onChange={() => toggleHRSelection(hr.id)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`hr-${hr.id}`} className="ml-3 block text-sm text-gray-700">
                    {hr.name} <span className="text-gray-500">({hr.company}) - {hr.email}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Preview Button */}
          <div className="pt-2">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={handleSendApplications}
              disabled={!selectedResume || !selectedTemplate || selectedHRs.length === 0}
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              Preview & Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendApplications;
