import React, { useState, useEffect } from 'react';
import { FiFile, FiTrash2, FiUploadCloud, FiDownload, FiCheckCircle, FiHardDrive, FiCalendar, FiStar } from 'react-icons/fi';
import { resumeAPI } from '../services/resumeService';
import { TrashIcon } from 'lucide-react';
import { toast } from 'react-toastify';

const MyResumes = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch resumes on component mount
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setIsLoading(true);
        const response = await resumeAPI.getResumes();
        if (response.success) {
          console.log('Fetched resumes:', response.data?.resumes);
          setResumes(response.data?.resumes || []);
        }
      } catch (err) {
        console.error('Failed to fetch resumes:', err);
        toast.error('Failed to load resumes. Please try again.');
      } finally {
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
      toast.error('Please upload a PDF, DOC, or DOCX file');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (selectedFile.size > maxSize) {
      toast.error('File size should be less than 5MB');
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    setIsUploading(true);

    try {
      const result = await resumeAPI.uploadResume(file);
      
      if (result.success) {
        // Refresh the resumes list
        const fetchResumes = async () => {
          const result = await resumeAPI.getResumes();
          if (result.success) {
            setResumes(result.data?.resumes || []);
          }
        };
        fetchResumes();
        
        toast.success('Resume uploaded successfully!');
        setFile(null);
        document.getElementById('resume-upload').value = '';
      } else {
        // Handle specific resume limit error
        if (result.error?.includes('Maximum of 3 resumes allowed')) {
          toast.error('You can only upload a maximum of 3 resumes. Please delete an existing resume to upload a new one.', {
            autoClose: 5000, // Show for 5 seconds
            position: 'top-right'
          });
        } else {
          toast.error(result.error || 'Failed to upload resume');
        }
      }
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error(err.message || 'Failed to upload resume');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    try {
      const result = await resumeAPI.deleteResume(id);
      if (result.success) {
        setResumes(resumes.filter(resume => resume.id !== id));
        toast.success('Resume deleted successfully!');
      } else {
        toast.error(result.error || 'Failed to delete resume');
      }
    } catch (err) {
      console.error('Failed to delete resume:', err);
      toast.error('Failed to delete resume. Please try again.');
    }
  };

  const handleDownload = async (resume) => {
    try {
      const result = await resumeAPI.downloadResume(resume.id, resume.originalName);
      if (result.success) {
        // The blob is already handled in the service
        toast.success('Download started!');
      } else {
        toast.error(result.error || 'Failed to download resume');
      }
    } catch (err) {
      console.error('Failed to download resume:', err);
      toast.error('Failed to download resume. Please try again.');
    }
  };

  const handleSetActive = async (id) => {
    console.log('Setting active resume with ID:', id);
    try {
      const result = await resumeAPI.setActiveResume(id);
      if (result.success) {
        setResumes(resumes.map(resume => ({
          ...resume,
          isActive: resume.id === id
        })));
        toast.success('Resume set as active!');
      } else {
        toast.error(result.error || 'Failed to set active resume');
      }
    } catch (err) {
      console.error('Failed to set active resume:', err);
      toast.error('Failed to set active resume. Please try again.');
    }
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

            </div>
        </div>

        {/* Resumes Grid */}
        <div className="mt-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.isArray(resumes) && resumes.map((resume) => (
                <div key={resume.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="p-6">
                    <div className="flex flex-col">
                      {/* File Icon and Name Section */}
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="flex-shrink-0 h-13 w-13 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center border border-blue-200">
                          <FiFile className="h-7 w-7 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 break-words leading-tight" title={resume.originalName}>
                            {resume.originalName}
                          </h3>
                          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <FiHardDrive className="h-4 w-4 mr-2 text-gray-400" />
                              <span className="font-medium">{(resume.fileSize / 1024).toFixed(1)} KB</span>
                            </div>
                            <div className="flex items-center">
                              <FiCalendar className="h-4 w-4 mr-2 text-gray-400" />
                              <span className="font-medium">{new Date(resume.uploadedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Active Status Badge */}
                      {resume.isActive && (
                        <div className="mb-4">
                          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg border-2 border-green-400">
                            <FiCheckCircle className="mr-2 h-4 w-4" />
                            Currently Active
                          </span>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleDownload(resume)}
                              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all duration-200 border border-blue-200 hover:border-blue-300"
                              title="Download"
                            >
                              <FiDownload className="h-4 w-4 mr-2" />
                              Download
                            </button>
                            {!resume.isActive && (
                              <button
                                onClick={() => handleSetActive(resume.id)}
                                className="inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                                title="Set as active"
                              >
                                <FiStar className="h-4 w-4 mr-2" />
                                Make Active
                              </button>
                            )}
                          </div>
                          <button
                            onClick={() => handleDelete(resume.id)}
                            className="inline-flex items-center p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                            title="Delete"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {(!Array.isArray(resumes) || resumes.length === 0) && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  Your uploaded resumes will appear here
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyResumes;
