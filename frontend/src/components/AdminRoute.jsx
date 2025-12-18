import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SuperAdminRoute = ({ redirectPath = '/dashboard' }) => {
    const { loading, isSuperAdmin } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center p-4">Loading...</div>;
    }

    if (!isSuperAdmin) {
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

export default SuperAdminRoute;
