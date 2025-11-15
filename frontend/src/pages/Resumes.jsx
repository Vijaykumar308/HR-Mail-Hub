import { useState, useEffect } from 'react';
import { resumeAPI } from '../services/resumeService';
import { toast } from 'react-toastify';
import ResumeUpload from '../components/ResumeUpload';

const Resumes = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState({
    delete: '',
    download: '',
    setActive: ''
  });

  // Fetch resumes on component mount
  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const result = await resumeAPI.getResumes();
      
      if (result.success) {
        setResumes(result.data || []);
      } else {
        toast.error(result.error || 'Failed to load resumes');
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
      toast.error('An error occurred while fetching resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (resumeId) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    try {
      setIsProcessing(prev => ({ ...prev, delete: resumeId }));
      const result = await resumeAPI.deleteResume(resumeId);
      
      if (result.success) {
        toast.success('Resume deleted successfully');
        fetchResumes(); // Refresh the list
      } else {
        toast.error(result.error || 'Failed to delete resume');
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast.error('An error occurred while deleting the resume');
    } finally {
      setIsProcessing(prev => ({ ...prev, delete: '' }));
    }
  };

  const handleDownload = async (resumeId, fileName) => {
    try {
      setIsProcessing(prev => ({ ...prev, download: resumeId }));
      const result = await resumeAPI.downloadResume(resumeId, fileName);
      
      if (!result.success) {
        toast.error(result.error || 'Failed to download resume');
      }
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast.error('An error occurred while downloading the resume');
    } finally {
      setIsProcessing(prev => ({ ...prev, download: '' }));
    }
  };

  const handleSetActive = async (resumeId) => {
    try {
      setIsProcessing(prev => ({ ...prev, setActive: resumeId }));
      const result = await resumeAPI.setActiveResume(resumeId);
      
      if (result.success) {
        toast.success('Primary resume updated successfully');
        fetchResumes(); // Refresh the list
      } else {
        toast.error(result.error || 'Failed to set active resume');
      }
    } catch (error) {
      console.error('Error setting active resume:', error);
      toast.error('An error occurred while updating the primary resume');
    } finally {
      setIsProcessing(prev => ({ ...prev, setActive: '' }));
    }
  };

  // Format date to a readable string
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Resumes</h1>
      </div>

      {/* Upload Section */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Upload New Resume</h2>
        <ResumeUpload onUploadSuccess={fetchResumes} />
      </div>

      {/* Resumes List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {loading ? (
            <li className="px-6 py-4">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            </li>
          ) : resumes.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              No resumes uploaded yet. Upload your first resume above.
            </li>
          ) : (
            resumes.map((resume) => (
              <li key={resume._id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center min-w-0">
                    <div className="min-w-0">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {resume.originalName || 'Resume'}
                        </p>
                        {resume.isActive && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Primary
                          </span>
                        )}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        Uploaded {formatDate(resume.uploadedAt)}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-2">
                    {!resume.isActive && (
                      <button
                        type="button"
                        onClick={() => handleSetActive(resume._id)}
                        disabled={isProcessing.setActive === resume._id}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                      >
                        {isProcessing.setActive === resume._id ? 'Setting...' : 'Set as Primary'}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDownload(resume._id, resume.originalName)}
                      disabled={isProcessing.download === resume._id}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                    >
                      {isProcessing.download === resume._id ? 'Downloading...' : 'Download'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(resume._id)}
                      disabled={isProcessing.delete === resume._id}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      {isProcessing.delete === resume._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Resumes;