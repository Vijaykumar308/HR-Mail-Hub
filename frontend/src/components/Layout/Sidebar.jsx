import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const location = useLocation();
  const { user, isSuperAdmin, hasPermission } = useAuth(); // isAdmin is not needed here if restricted

  const navItems = [
    { name: 'Dashboard', icon: '📊', path: '/dashboard' },
    ...(isSuperAdmin ? [{ name: 'Users', icon: '👥', path: '/users' }] : []),
    ...(hasPermission('hrDirectory', 'read') ? [{ name: 'HR Directory', icon: '📇', path: '/hr-directory' }] : []),
    ...(hasPermission('resumes', 'read') ? [{ name: 'My Resumes', icon: '📄', path: '/resumes' }] : []),
    ...(hasPermission('templates', 'read') ? [{ name: 'Message Template', icon: '✏️', path: '/templates' }] : []),
    ...(hasPermission('analytics', 'read') ? [{ name: 'Analytics', icon: '📈', path: '/analytics' }] : []),
    { name: 'Settings', icon: '⚙️', path: '/settings' },
  ];

  // Get user initial or default to 'U'
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className={`
      fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      {/* Logo */}
      <div className="flex items-center justify-between h-16 border-b border-gray-200 px-4">
        <h1 className="text-xl font-bold text-primary-600">HRMailHub</h1>
        <button
          onClick={closeSidebar}
          className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${location.pathname === item.path
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
            {userInitial}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

import PropTypes from 'prop-types';

Sidebar.propTypes = {
  isOpen: PropTypes.bool,
  closeSidebar: PropTypes.func,
};

export default Sidebar;
