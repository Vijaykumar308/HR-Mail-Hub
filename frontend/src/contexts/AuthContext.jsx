import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const { data } = await authAPI.getMe();
          setUser(data.user);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);

      if (response?.success && response?.token) {
        localStorage.setItem('token', response.token);
        // Make sure the backend returns user data in the response
        const userData = response.data?.user || response.user || { email };
        setUser(userData);
        return {
          success: true,
          user: userData
        };
      }

      // Handle case where token is missing in response or login failed
      return {
        success: false,
        error: response?.error || response?.message || 'Invalid response from server'
      };

    } catch (error) {
      console.error('Login error:', error);
      // Extract error message from different possible error formats
      const errorMessage = error.response?.data?.message ||
        error.message ||
        'Login failed. Please check your credentials and try again.';

      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const signup = async (userData) => {
    try {
      setError(null);
      const { token, data } = await authAPI.signup(userData);
      localStorage.setItem('token', token);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      setError(err || 'Signup failed. Please try again.');
      return { success: false, error: err };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        loading,
        error,
        login,
        signup,
        logout,
        setError,
        isAdmin: user?.role === 'admin' || user?.role === 'ADMIN', // Keeping basic admin check if needed for legacy
        isSuperAdmin: user?.role === 'SUPER_ADMIN',
        hasPermission: (moduleName, action) => {
          if (user?.role === 'SUPER_ADMIN') return true;

          if (!user?.permissions?.[moduleName]) return false;

          const perm = user.permissions[moduleName];
          if (perm.access !== 'enabled') return false;

          if (action === 'create') return !!perm.create;
          if (action === 'delete') return !!perm.delete;
          if (action === 'read') return perm.read !== 'none';
          if (action === 'edit') return perm.edit !== 'none';

          return false;
        }
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
