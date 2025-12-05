import React from 'react';
import { X, Filter, Calendar, Users, Briefcase, MapPin, Hash, Search } from 'lucide-react';

const FilterDrawer = ({
    isOpen,
    onClose,
    filters,
    onFilterChange,
    onApply,
    onReset,
    industries = [],
    locations = []
}) => {
    const companySizes = [
        '1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'
    ];

    const statuses = ['active', 'pending', 'inactive'];

    return (
        <div className={`fixed inset-0 overflow-hidden z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            <div className={`absolute inset-0 overflow-hidden`}>
                {/* Overlay */}
                <div
                    className={`absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={onClose}
                />

                {/* Drawer panel */}
                <div className={`fixed inset-y-0 right-0 pl-10 max-w-full flex transform transition duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="w-screen max-w-md">
                        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                            {/* Header */}
                            <div className="px-4 py-6 bg-gray-50 sm:px-6 border-b border-gray-200">
                                <div className="flex items-start justify-between">
                                    <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                        <Filter className="h-5 w-5 mr-2 text-gray-500" />
                                        Filters
                                    </h2>
                                    <div className="ml-3 h-7 flex items-center">
                                        <button
                                            type="button"
                                            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                            onClick={onClose}
                                        >
                                            <span className="sr-only">Close panel</span>
                                            <X className="h-6 w-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="relative flex-1 py-6 px-4 sm:px-6 space-y-6">

                                {/* Search */}
                                <div>
                                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                                        Search
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Search className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="search"
                                            id="search"
                                            value={filters.search || ''}
                                            onChange={onFilterChange}
                                            className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                            placeholder="Name or Company"
                                        />
                                    </div>
                                </div>

                                {/* Industry */}
                                <div>
                                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                                        Industry
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Briefcase className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <select
                                            id="industry"
                                            name="industry"
                                            value={filters.industry || ''}
                                            onChange={onFilterChange}
                                            className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                        >
                                            <option value="">All Industries</option>
                                            {industries.map(ind => (
                                                <option key={ind} value={ind}>{ind}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Location */}
                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                        Location
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <select
                                            id="location"
                                            name="location"
                                            value={filters.location || ''}
                                            onChange={onFilterChange}
                                            className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                        >
                                            <option value="">All Locations</option>
                                            {locations.map(loc => (
                                                <option key={loc} value={loc}>{loc}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Company Size */}
                                <div>
                                    <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-1">
                                        Company Size
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Users className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <select
                                            id="companySize"
                                            name="companySize"
                                            value={filters.companySize || ''}
                                            onChange={onFilterChange}
                                            className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                        >
                                            <option value="">Any Size</option>
                                            {companySizes.map(size => (
                                                <option key={size} value={size}>{size}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <div className="flex flex-wrap gap-2">
                                        {statuses.map(status => (
                                            <button
                                                key={status}
                                                type="button"
                                                onClick={() => {
                                                    const event = { target: { name: 'status', value: filters.status === status ? '' : status } };
                                                    onFilterChange(event);
                                                }}
                                                className={`px-3 py-1 rounded-full text-xs font-medium border ${filters.status === status
                                                        ? 'bg-primary-100 text-primary-800 border-primary-200'
                                                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Date Range */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Added</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <input
                                                type="date"
                                                name="startDate"
                                                value={filters.startDate || ''}
                                                onChange={onFilterChange}
                                                className="focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                placeholder="Start Date"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="date"
                                                name="endDate"
                                                value={filters.endDate || ''}
                                                onChange={onFilterChange}
                                                className="focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                placeholder="End Date"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Resumes Shared Range */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Resumes Shared</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Hash className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <input
                                                type="number"
                                                name="minResumes"
                                                value={filters.minResumes || ''}
                                                onChange={onFilterChange}
                                                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                                placeholder="Min"
                                                min="0"
                                            />
                                        </div>
                                        <div className="relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Hash className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <input
                                                type="number"
                                                name="maxResumes"
                                                value={filters.maxResumes || ''}
                                                onChange={onFilterChange}
                                                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                                placeholder="Max"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Sort By */}
                                <div>
                                    <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                                        Sort By
                                    </label>
                                    <select
                                        id="sort"
                                        name="sort"
                                        value={filters.sort || '-createdAt'}
                                        onChange={onFilterChange}
                                        className="focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    >
                                        <option value="-createdAt">Newest First</option>
                                        <option value="createdAt">Oldest First</option>
                                        <option value="name">Name (A-Z)</option>
                                        <option value="-name">Name (Z-A)</option>
                                        <option value="company">Company (A-Z)</option>
                                        <option value="-resumesShared">Most Resumes Shared</option>
                                    </select>
                                </div>

                            </div>

                            {/* Footer */}
                            <div className="flex-shrink-0 px-4 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                    onClick={onReset}
                                >
                                    Reset
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                    onClick={onApply}
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterDrawer;
