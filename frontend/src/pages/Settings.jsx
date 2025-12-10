import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import userService from '../services/userService';
import { authAPI } from '../services/api';
import EmailConfiguration from './EmailConfiguration';

const Settings = () => {
  const { user } = useAuth(); // We might need to update user context after profile update
  const [activeTab, setActiveTab] = useState('account');
  const [loadingSection, setLoadingSection] = useState(null); // 'profile', 'password', 'notifications'

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: {
      email: true,
      applicationUpdates: true,
      responseUpdates: true,
      weeklyDigest: true,
    },
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        notifications: {
          ...prev.notifications,
          ...(user.notifications || {})
        }
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoadingSection('profile');
    try {
      const updateData = {
        name: formData.name,
        email: formData.email
      };
      await userService.updateMe(updateData);
      toast.success('Profile updated successfully.');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoadingSection(null);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setLoadingSection('password');
    try {
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('New passwords do not match');
        return;
      }
      if (!formData.currentPassword) {
        toast.error('Current password is required');
        return;
      }

      await authAPI.updatePassword({
        currentPassword: formData.currentPassword,
        password: formData.newPassword,
        passwordConfirm: formData.confirmPassword
      });

      toast.success('Password updated successfully.');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error(error.message || 'Failed to update password');
    } finally {
      setLoadingSection(null);
    }
  };

  const handleSaveNotifications = async (e) => {
    e.preventDefault();
    setLoadingSection('notifications');
    try {
      const updateData = {
        notifications: formData.notifications
      };
      await userService.updateMe(updateData);
      toast.success('Notification preferences updated.');
    } catch (error) {
      console.error('Error updating notifications:', error);
      toast.error(error.message || 'Failed to update notifications');
    } finally {
      setLoadingSection(null);
    }
  };

  const tabs = [
    { id: 'account', name: 'Account Settings', icon: '⚙️' },
    { id: 'email', name: 'Email Configuration', icon: '📧' },
    { id: 'billing', name: 'Billing', icon: '💳' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center`}
              >
                <span className="mr-2 text-lg">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="px-4 py-5 sm:p-6">
          {activeTab === 'email' ? (
            <EmailConfiguration />
          ) : activeTab === 'account' ? (
            <div className="space-y-10 divide-y divide-gray-200">

              {/* Section 1: Profile Information */}
              <form onSubmit={handleSaveProfile} className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                <div className="sm:col-span-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Profile Information</h3>
                    <p className="mt-1 text-sm text-gray-500">Update your public profile information.</p>
                  </div>
                  <button
                    type="submit"
                    disabled={loadingSection === 'profile'}
                    className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${loadingSection === 'profile' ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {loadingSection === 'profile' ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full name</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-lg">👤</span>
                    </div>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="block w-full pl-10 py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base transition duration-150 ease-in-out sm:text-sm"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-lg">📧</span>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full pl-10 py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base transition duration-150 ease-in-out sm:text-sm"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
              </form>

              {/* Section 2: Change Password */}
              <form onSubmit={handleSavePassword} className="pt-8 grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                <div className="sm:col-span-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Change Password</h3>
                    <p className="mt-1 text-sm text-gray-500">Update your password associated with your account.</p>
                  </div>
                  <button
                    type="submit"
                    disabled={loadingSection === 'password'}
                    className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${loadingSection === 'password' ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {loadingSection === 'password' ? 'Updating...' : 'Update Password'}
                  </button>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">Current Password</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">🔒</span>
                    </div>
                    <input
                      id="current-password"
                      name="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-10 py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base transition duration-150 ease-in-out sm:text-sm"
                      placeholder="••••••••"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        {showCurrentPassword ? (
                          <span role="img" aria-label="hide password">👁️‍🗨️</span>
                        ) : (
                          <span role="img" aria-label="show password">👁️</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">🔑</span>
                    </div>
                    <input
                      id="new-password"
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-10 py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base transition duration-150 ease-in-out sm:text-sm"
                      placeholder="New password"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        {showNewPassword ? (
                          <span role="img" aria-label="hide password">👁️‍🗨️</span>
                        ) : (
                          <span role="img" aria-label="show password">👁️</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">🔑</span>
                    </div>
                    <input
                      id="confirm-password"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-10 py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base transition duration-150 ease-in-out sm:text-sm"
                      placeholder="Confirm password"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        {showConfirmPassword ? (
                          <span role="img" aria-label="hide password">👁️‍🗨️</span>
                        ) : (
                          <span role="img" aria-label="show password">👁️</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Section 3: Notifications - HIDDEN FOR NOW */}
              {/*
                  <form onSubmit={handleSaveNotifications} className="pt-8">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Email Notifications</h3>
                            <p className="mt-1 text-sm text-gray-500">Manage your email notification preferences.</p>
                        </div>
                        <button
                          type="submit"
                          disabled={loadingSection === 'notifications'}
                          className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${loadingSection === 'notifications' ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                           {loadingSection === 'notifications' ? 'Saving...' : 'Save Preferences'}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2">
                        <div className="relative flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="email"
                              name="notifications.email"
                              type="checkbox"
                              checked={formData.notifications.email}
                              onChange={handleInputChange}
                              className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="email" className="font-medium text-gray-700">Email notifications</label>
                            <p className="text-gray-500">Get notified about important updates.</p>
                          </div>
                        </div>

                        <div className="relative flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="application-updates"
                              name="notifications.applicationUpdates"
                              type="checkbox"
                              checked={formData.notifications.applicationUpdates}
                              onChange={handleInputChange}
                              className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="application-updates" className="font-medium text-gray-700">Application updates</label>
                            <p className="text-gray-500">Get notified when status changes.</p>
                          </div>
                        </div>

                        <div className="relative flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="response-updates"
                              name="notifications.responseUpdates"
                              type="checkbox"
                              checked={formData.notifications.responseUpdates}
                              onChange={handleInputChange}
                              className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="response-updates" className="font-medium text-gray-700">Response updates</label>
                            <p className="text-gray-500">Get notified when you receive a response.</p>
                          </div>
                        </div>

                        <div className="relative flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="weekly-digest"
                              name="notifications.weeklyDigest"
                              type="checkbox"
                              checked={formData.notifications.weeklyDigest}
                              onChange={handleInputChange}
                              className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="weekly-digest" className="font-medium text-gray-700">Weekly digest</label>
                            <p className="text-gray-500">Get a weekly summary of activity.</p>
                          </div>
                        </div>
                    </div>
                  </form>
                  */}
            </div>
          ) : activeTab === 'billing' ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Billing Information</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your subscription and payment information.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Pro Plan</h4>
                    <p className="text-sm text-gray-500">$9.99/month</p>
                  </div>
                  <div className="ml-auto">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Change Plan
                    </button>
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-medium text-gray-900">Payment Method</h4>
                  <div className="mt-2 flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Visa ending in 4242</p>
                      <p className="text-sm text-gray-500">Expires 12/2024</p>
                    </div>
                    <div className="ml-auto">
                      <button
                        type="button"
                        className="text-sm font-medium text-primary-600 hover:text-primary-500"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Settings;
