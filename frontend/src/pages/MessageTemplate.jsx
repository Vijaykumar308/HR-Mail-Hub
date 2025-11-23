import React, { useState, useEffect } from 'react';
import { templatesAPI } from '../services/api';
import { toast } from 'react-toastify';

const MessageTemplate = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState({
    _id: null,
    name: '',
    subject: '',
    body: '',
    isDefault: false
  });

  const defaultBody = 'Dear [HR Name],\n\nI hope this message finds you well. I am writing to express my interest in the [Position] role at [Company Name].\n\n[Your personalized message here]\n\nI have attached my resume for your review. I would welcome the opportunity to discuss how my skills and experience align with your needs.\n\nThank you for your time and consideration.\n\nBest regards,\n[Your Name]\n[Your Contact Information]';

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await templatesAPI.getAll();
      setTemplates(data);
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTemplate = (template) => {
    setCurrentTemplate(template);
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    if (templates.length >= 3) {
      toast.error('You can only create up to 3 templates.');
      return;
    }
    setCurrentTemplate({
      _id: null,
      name: '',
      subject: '',
      body: defaultBody,
      isDefault: false
    });
    setIsModalOpen(true);
  };

  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    try {
      if (currentTemplate._id) {
        // Update existing template
        const updatedTemplate = await templatesAPI.update(currentTemplate._id, currentTemplate);
        setTemplates(templates.map(t => t._id === updatedTemplate._id ? updatedTemplate : t));
        toast.success('Template updated successfully');
      } else {
        // Add new template
        const newTemplate = await templatesAPI.create(currentTemplate);
        setTemplates([newTemplate, ...templates]);
        toast.success('Template created successfully');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDeleteTemplate = async (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await templatesAPI.delete(id);
        setTemplates(templates.filter(t => t._id !== id));
        toast.success('Template deleted successfully');
      } catch (error) {
        toast.error(error);
      }
    }
  };

  const setAsDefault = async (id) => {
    try {
      const template = templates.find(t => t._id === id);
      if (!template) return;

      const updatedTemplate = await templatesAPI.update(id, { ...template, isDefault: true });

      // Update local state to reflect change (only one default allowed)
      setTemplates(templates.map(t => ({
        ...t,
        isDefault: t._id === id
      })));
      toast.success('Default template updated');
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Email Templates</h2>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage your email templates for job applications
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreateNew}
          disabled={templates.length >= 3}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${templates.length >= 3 ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Template {templates.length >= 3 && '(Limit Reached)'}
        </button>
      </div>

      {/* Templates List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading templates...</div>
        ) : templates.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No templates found. Create your first email template!
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {templates.map((template) => (
              <li key={template._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                        {template.isDefault && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Subject:</span> {template.subject}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Last updated: {new Date(template.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!template.isDefault && (
                      <button
                        onClick={() => setAsDefault(template._id)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                        title="Set as default"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => handleEditTemplate(template)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Edit"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    {!template.isDefault && (
                      <button
                        onClick={() => handleDeleteTemplate(template._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Template Editor Modal */}
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {currentTemplate._id ? 'Edit Template' : 'Create New Template'}
                  </h3>
                  <form onSubmit={handleSaveTemplate} className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="template-name" className="block text-sm font-medium text-gray-700">
                        Template Name
                      </label>
                      <input
                        type="text"
                        id="template-name"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={currentTemplate.name}
                        onChange={(e) => setCurrentTemplate({ ...currentTemplate, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="template-subject" className="block text-sm font-medium text-gray-700">
                        Email Subject
                      </label>
                      <input
                        type="text"
                        id="template-subject"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={currentTemplate.subject}
                        onChange={(e) => setCurrentTemplate({ ...currentTemplate, subject: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="template-body" className="block text-sm font-medium text-gray-700">
                        Email Body
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="template-body"
                          rows={12}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2 font-mono text-sm"
                          value={currentTemplate.body}
                          onChange={(e) => setCurrentTemplate({ ...currentTemplate, body: e.target.value })}
                          required
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Use placeholders like [HR Name], [Company], [Position] to personalize emails
                      </p>
                    </div>
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                      >
                        Save Template
                      </button>
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                        onClick={() => setIsModalOpen(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageTemplate;
