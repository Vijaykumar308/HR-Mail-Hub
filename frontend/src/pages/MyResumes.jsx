import React, { useState, useEffect } from 'react';
import { FiFile, FiTrash2, FiUploadCloud, FiDownload, FiCheckCircle } from 'react-icons/fi';
import { resumeAPI } from '../services/resumeService';
import { TrashIcon } from 'lucide-react';

const MyResumes = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch resumes on component mount
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setIsLoading(true);
        // Replace with actual API call
        // const response = await resumeAPI.getResumes();
        // setResumes(response.data || []);
        
        // Mock data for demonstration
        setTimeout(() => {
          setResumes([
            {
              id: 1,
              name: 'Software_Engineer_Resume.pdf',
              uploaded: '2023-10-15',
              isActive: true,
              size: '245 KB',
              url: '/path/to/resume1.pdf'
            },
            {
              id: 2,
              name: 'Frontend_Developer_Resume.pdf',
              uploaded: '2023-09-28',
              isActive: false,
              size: '198 KB',
              url: '/path/to/resume2.pdf'
            }
          ]);
          setIsLoading(false);
        }, 500);
      } catch (err) {
        console.error('Failed to fetch resumes:', err);
        setError('Failed to load resumes. Please try again.');
        setIsLoading(false);
      }
    };

    fetchResumes();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF, DOC, or DOCX file');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (selectedFile.size > maxSize) {
      setError('File size should be less than 5MB');
      return;
    }

    setFile(selectedFile);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Uploading file:', file);
      console.log('File type:', file.type);
      console.log('File size:', file.size);
      
      const result = await resumeAPI.uploadResume(file);
      
      if (result.success) {
        // Refresh the resumes list
        const fetchResumes = async () => {
          const result = await resumeAPI.getResumes();
          if (result.success) {
            setResumes(result.data || []);
          }
        };
        fetchResumes();
        
        setSuccess('Resume uploaded successfully!');
        setFile(null);
        document.getElementById('resume-upload').value = '';
      } else {
        setError(result.error || 'Failed to upload resume');
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    try {
      // Replace with actual API call
      // await resumeAPI.deleteResume(id);
      setResumes(resumes.filter(resume => resume.id !== id));
      setSuccess('Resume deleted successfully!');
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Failed to delete resume. Please try again.');
    }
  };

  const handleDownload = (url, name) => {
    // For demo purposes - in a real app, this would trigger a download
    console.log(`Downloading ${name} from ${url}`);
    // Actual implementation would be similar to:
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSetActive = (id) => {
    setResumes(resumes.map(resume => ({
      ...resume,
      isActive: resume.id === id
    })));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
          <p className="mt-2 text-sm text-gray-600">Manage and organize your uploaded resumes</p>
        </div>

        {/* File Upload Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiUploadCloud className="w-10 h-10 text-gray-400 mb-2" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, or DOCX (MAX. 5MB)
                  </p>
                </div>
                <input 
                  id="resume-upload" 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {file && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
                <div className="flex items-center">
                  <FiFile className="h-5 w-5 text-blue-500 mr-2" />
                  <div className="truncate max-w-xs">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700 p-1"
                  onClick={() => {
                    setFile(null);
                    document.getElementById('resume-upload').value = '';
                  }}
                  aria-label="Remove file"
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleUpload}
                disabled={!file || isUploading}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  !file || isUploading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <FiUploadCloud className="-ml-1 mr-2 h-4 w-4" />
                    Upload Resume
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 text-sm text-green-700 bg-green-100 rounded-md">
                {success}
              </div>
            )}
          </div>
        </div>

        {/* Resumes Grid */}
        <div className="mt-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : resumes.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {resumes.map((resume) => (
                <div key={resume.id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FiFile className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 truncate">{resume.name}</h3>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <span>{resume.size}</span>
                          <span className="mx-2">•</span>
                          <span>Uploaded {resume.uploaded}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex items-center justify-between">
                      {resume.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <FiCheckCircle className="mr-1.5 h-3.5 w-3.5 text-green-500" />
                          Active Resume
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSetActive(resume.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Set as Active
                        </button>
                      )}
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDownload(resume.url, resume.name)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
                          title="Download resume"
                        >
                          <FiDownload className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(resume.id)}
                          className="p-1.5 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50"
                          title="Delete resume"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow">
              <FiFile className="mx-auto h-16 w-16 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No resumes</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by uploading your first resume.
              </p>
              <div className="mt-6">
                <label className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                  <FiUploadCloud className="-ml-1 mr-2 h-4 w-4" />
                  Upload Resume
                  <input 
                    id="resume-upload" 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyResumes;
