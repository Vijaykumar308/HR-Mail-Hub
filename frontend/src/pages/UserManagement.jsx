import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import { toast } from 'react-toastify';

const modules = ['hrDirectory', 'templates', 'resumes', 'analytics'];

const initialPermissions = {
    hrDirectory: { access: 'enabled', create: false, read: 'all', edit: 'none', delete: false },
    templates: { access: 'enabled', create: true, read: 'all', edit: 'own', delete: true },
    resumes: { access: 'enabled', create: true, read: 'all', edit: 'own', delete: true },
    analytics: { access: 'disabled', create: false, read: 'none', edit: 'none', delete: false },
};

const UserModal = ({ isOpen, onClose, user, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'REGULAR',
        permissions: initialPermissions
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                role: user.role || 'REGULAR',
                // Merge to ensure structure, handling legacy or missing modules
                permissions: { ...initialPermissions, ...user.permissions }
            });
        }
        // We don't handle "new user" case anymore as per requirements, 
        // but kept structure for editing.
    }, [user, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePermissionChange = (moduleName, field, value) => {
        setFormData(prev => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [moduleName]: {
                    ...prev.permissions[moduleName],
                    [field]: value
                }
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (user) {
            onSave({ ...formData, id: user._id });
        }
    };

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
                <div className="flex justify-between items-center p-6 border-b">
                    <h3 className="text-xl font-semibold text-gray-900">
                        Edit User: {user.name}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                disabled
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-gray-100"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            >
                                <option value="REGULAR">REGULAR</option>
                                <option value="ADMIN">ADMIN</option>
                                <option value="SUPER_ADMIN">SUPER ADMIN</option>
                            </select>
                            <p className="mt-1 text-xs text-gray-500">
                                ADMIN and REGULAR roles are subject to permissions below. SUPER ADMIN has full access.
                            </p>
                        </div>
                    </div>

                    {(formData.role === 'REGULAR' || formData.role === 'ADMIN') && (
                        <div className="border-t pt-4">
                            <h4 className="text-lg font-medium text-gray-900 mb-4">Module Permissions</h4>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Create</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Read</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edit</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {modules.map(module => (
                                            <tr key={module}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">{module.replace(/([A-Z])/g, ' $1').trim()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <select
                                                        value={formData.permissions[module]?.access || 'not-set'}
                                                        onChange={(e) => handlePermissionChange(module, 'access', e.target.value)}
                                                        className="text-sm border-gray-300 rounded-md shadow-sm border p-1"
                                                    >
                                                        <option value="enabled">Enabled</option>
                                                        <option value="disabled">Disabled</option>
                                                        <option value="not-set">Not Set</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!formData.permissions[module]?.create}
                                                        onChange={(e) => handlePermissionChange(module, 'create', e.target.checked)}
                                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <select
                                                        value={formData.permissions[module]?.read || 'none'}
                                                        onChange={(e) => handlePermissionChange(module, 'read', e.target.value)}
                                                        className="text-sm border-gray-300 rounded-md shadow-sm border p-1"
                                                    >
                                                        <option value="all">All</option>
                                                        <option value="own">Own</option>
                                                        <option value="none">None</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <select
                                                        value={formData.permissions[module]?.edit || 'none'}
                                                        onChange={(e) => handlePermissionChange(module, 'edit', e.target.value)}
                                                        className="text-sm border-gray-300 rounded-md shadow-sm border p-1"
                                                    >
                                                        <option value="all">All</option>
                                                        <option value="own">Own</option>
                                                        <option value="none">None</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!formData.permissions[module]?.delete}
                                                        onChange={(e) => handlePermissionChange(module, 'delete', e.target.checked)}
                                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-6 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const fetchUsers = async () => {
        try {
            const response = await userService.getAllUsers();
            setUsers(response?.data?.users || []);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEdit = (user) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await userService.deleteUser(id);
                toast.success('User deleted successfully');
                fetchUsers();
            } catch (error) {
                toast.error('Failed to delete user');
            }
        }
    };

    const handleSave = async (userData) => {
        try {
            if (userData.id) {
                await userService.updateUser(userData.id, userData);
                toast.success('User updated successfully');
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error(error);
            toast.error('Operation failed');
        }
    };

    if (loading) return <div className="p-6">Loading users...</div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                {/* No Add User button as per requirements */}
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'SUPER_ADMIN' ? 'bg-red-100 text-red-800' :
                                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                        {user.role ? user.role.replace('_', ' ').toUpperCase() : 'USER'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleEdit(user)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                    <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={editingUser}
                onSave={handleSave}
            />
        </div>
    );
};

export default UserManagement;
