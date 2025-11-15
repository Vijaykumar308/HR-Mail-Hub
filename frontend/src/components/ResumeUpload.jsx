import { useState } from 'react';
import { resumeAPI } from '../services/resumeService';
import { toast } from 'react-toastify';

const ResumeUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    // Basic file validation
    const allowedTypes = ['application/pdf', 'application/msword', 
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Please upload a PDF or Word document');
      return;
    }

    if (selectedFile.size > maxSize) {
      toast.error('File size should be less than 5MB');
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const result = await resumeAPI.uploadResume(
        file,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      if (result.success) {
        toast.success('Resume uploaded successfully!');
        // Clear the file input
        setFile(null);
        document.getElementById('file-upload').value = '';
        
        // Call the success callback if provided
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      } else {
        toast.error(result.error || 'Failed to upload resume');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('An error occurred during upload');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <label className="block">
          <span className="sr-only">Choose resume file</span>
          <input
            id="file-upload"
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

      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-primary-600 h-2.5 rounded-full" 
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      {file && !isUploading && (
        <div className="text-sm text-gray-600">
          Selected file: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;