import React from 'react';

const MyResumes = () => {
  // Sample resume data
  const resumes = [
    {
      id: 1,
      name: 'Software_Engineer_Resume.pdf',
      uploaded: '2023-10-15',
      isActive: true,
      size: '245 KB'
    },
    {
      id: 2,
      name: 'Frontend_Developer_Resume.pdf',
      uploaded: '2023-09-28',
      isActive: false,
      size: '198 KB'
    },
    {
      id: 3,
      name: 'Full_Stack_Resume.pdf',
      uploaded: '2023-09-10',
      isActive: false,
      size: '312 KB'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Resumes</h2>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Upload New Resume
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Your Resumes</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage and organize your uploaded resumes</p>
        </div>
        
        <ul className="divide-y divide-gray-200">
          {resumes.map((resume) => (
            <li key={resume.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{resume.name}</div>
                    <div className="text-sm text-gray-500">
                      {resume.size} • Uploaded on {resume.uploaded}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {resume.isActive && (
                    <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                      Active
                    </span>
                  )}
                  <button className="text-primary-600 hover:text-primary-900 text-sm font-medium">
                    Set as Active
                  </button>
                  <button className="text-gray-500 hover:text-gray-700">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyResumes;
