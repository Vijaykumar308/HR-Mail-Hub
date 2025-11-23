import React, { useState, useEffect } from 'react';
import { templatesAPI } from '../services/api';
import { resumeAPI } from '../services/resumeService';
import { toast } from 'react-toastify';

const EmailModal = ({ isOpen, onClose, recipients, onSendEmail, isLoading }) => {
  const [templates, setTemplates] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [previewData, setPreviewData] = useState({
    subject: '',
    message: ''
  });
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      setLoadingData(true);
      const [templatesData, resumesData] = await Promise.all([
        templatesAPI.getAll(),
        resumeAPI.getResumes()
      ]);
      setTemplates(templatesData);
      setResumes(resumesData.data.resumes || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load templates or resumes');
    } finally {
      setLoadingData(false);
    }
  };

  const handleTemplateChange = (templateId) => {
    setSelectedTemplateId(templateId);
    const template = templates.find(t => t._id === templateId);
    if (template) {
      setPreviewData({
        subject: template.subject,
        message: template.body
      });
    } else {
      setPreviewData({
        subject: '',
        message: ''
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendEmail({
      recipients,
      subject: previewData.subject,
      message: previewData.message,
      resumeId: selectedResumeId
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Send Email
                  </h3>

                  {/* Recipients Display */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      To: {recipients.length === 1 ? recipients[0].email : `${recipients.length} recipients`}
                    </label>
                    {recipients.length > 1 && (
                      <div className="max-h-20 overflow-y-auto bg-gray-50 p-2 rounded text-xs text-gray-600 border border-gray-200">
                        {recipients.map(r => `${r.name} (${r.email})`).join(', ')}
                      </div>
                    )}
                  </div>

                  {loadingData ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                      <p className="mt-2 text-sm text-gray-500">Loading templates and resumes...</p>
                    </div>
                  ) : (
                    <>
                      {/* Template Selection */}
                      <div className="mb-4">
                        <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-2">
                          Select Template
                        </label>
                        <select
                          id="template"
                          value={selectedTemplateId}
                          onChange={(e) => handleTemplateChange(e.target.value)}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                          required
                        >
                          <option value="">-- Select a Template --</option>
                          {templates.map(template => (
                            <option key={template._id} value={template._id}>
                              {template.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Resume Selection */}
                      <div className="mb-4">
                        <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
                          Select Resume to Attach
                        </label>
                        <select
                          id="resume"
                          value={selectedResumeId}
                          onChange={(e) => setSelectedResumeId(e.target.value)}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                        >
                          <option value="">-- No Attachment --</option>
                          {resumes.map(resume => (
                            <option key={resume.id} value={resume.id}>
                              {resume.originalName}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Preview Section */}
                      {selectedTemplateId && (
                        <div className="mb-4 border rounded-md p-4 bg-gray-50">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Email Preview</h4>
                          <div className="mb-2">
                            <span className="text-xs font-bold text-gray-500 uppercase">Subject:</span>
                            <p className="text-sm text-gray-900">{previewData.subject}</p>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-gray-500 uppercase">Body:</span>
                            <p className="text-sm text-gray-900 whitespace-pre-wrap mt-1">{previewData.message}</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={isLoading || loadingData || !selectedTemplateId}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Email'
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;
