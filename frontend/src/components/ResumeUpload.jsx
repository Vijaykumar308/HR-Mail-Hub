import { useState } from 'react';
import { resumeAPI } from '../services/resumeService';

export const ResumeUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    // Validate file type (PDF, DOC, DOCX)
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (selectedFile && !allowedTypes.includes(selectedFile.type)) {
      setError('Please upload a valid file (PDF, DOC, or DOCX)');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (selectedFile && selectedFile.size > maxSize) {
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
      const result = await resumeAPI.uploadResume(file);
      
      if (result.success) {
        setSuccess('Resume uploaded successfully!');
        setFile(null);
        document.getElementById('resume-upload').value = '';
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      } else {
        setError(result.error || 'Failed to upload resume');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('An error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <label className="block">
          <span className="sr-only">Choose resume file</span>
          <input
            id="resume-upload"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-primary-50 file:text-primary-700
              hover:file:bg-primary-100"
            disabled={isUploading}
          />
        </label>
        
        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || isUploading}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
            (!file || isUploading) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isUploading ? 'Uploading...' : 'Upload Resume'}
        </button>
      </div>

      {file && (
        <div className="text-sm text-gray-600">
          Selected file: {file.name} ({(file.size / 1024).toFixed(2)} KB)
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="text-sm text-green-600">
          {success}
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
