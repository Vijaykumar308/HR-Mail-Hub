import React, { useState } from 'react';

const EmailModal = ({ isOpen, onClose, recipients, onSendEmail, isLoading }) => {
  const [emailData, setEmailData] = useState({
    subject: '',
    message: '',
    template: 'custom'
  });

  const emailTemplates = [
    { value: 'custom', label: 'Custom Message', placeholder: 'Write your own message...' },
    { value: 'introduction', label: 'Introduction', placeholder: 'Dear HR Team,\n\nI hope this email finds you well. I would like to introduce myself and express my interest in potential opportunities at your organization.\n\nBest regards,' },
    { value: 'followup', label: 'Follow Up', placeholder: 'Dear [HR Name],\n\nI hope you are doing well. I wanted to follow up on my previous application and check if there are any updates regarding my profile.\n\nThank you for your time.\n\nBest regards,' },
    { value: 'inquiry', label: 'Job Inquiry', placeholder: 'Dear HR Team,\n\nI am writing to inquire about current job openings at [Company Name]. I have [X years] of experience in [Field/Industry].\n\nI would appreciate it if you could let me know about any suitable positions.\n\nThank you,\n[Your Name]' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendEmail({
      recipients,
      subject: emailData.subject,
      message: emailData.message,
      template: emailData.template
    });
  };

  const handleTemplateChange = (template) => {
    const selectedTemplate = emailTemplates.find(t => t.value === template);
    setEmailData(prev => ({
      ...prev,
      template,
      message: selectedTemplate.placeholder
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Compose Email
                  </h3>
                  
                  {/* Recipients Display */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      To: {recipients.length === 1 ? recipients[0].email : `${recipients.length} recipients`}
                    </label>
                    {recipients.length > 1 && (
                      <div className="max-h-20 overflow-y-auto bg-gray-50 p-2 rounded text-xs text-gray-600">
                        {recipients.map(r => `${r.name} (${r.email})`).join(', ')}
                      </div>
                    )}
                  </div>

                  {/* Template Selection */}
                  <div className="mb-4">
                    <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Template
                    </label>
                    <select
                      id="template"
                      value={emailData.template}
                      onChange={(e) => handleTemplateChange(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    >
                      {emailTemplates.map(template => (
                        <option key={template.value} value={template.value}>
                          {template.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subject */}
                  <div className="mb-4">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={emailData.subject}
                      onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Enter email subject"
                      required
                    />
                  </div>

                  {/* Message */}
                  <div className="mb-4">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      value={emailData.message}
                      onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
                      rows={8}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Write your message here..."
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={isLoading || !emailData.subject.trim() || !emailData.message.trim()}
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
