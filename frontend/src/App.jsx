import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import HRDirectory from './pages/HRDirectory';
import MyResumes from './pages/MyResumes';
import SendApplications from './pages/SendApplications';
import MessageTemplate from './pages/MessageTemplate';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import HRDirectoryCreate from './pages/HRDirectoryCreate';
import PWAInstallPrompt from './components/PWAInstallPrompt';

import { useAuth } from './contexts/AuthContext';

import LandingPage from './pages/LandingPage';

// A wrapper for protected routes
const ProtectedRoute = ({ redirectPath = '/login' }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />;
};

function App() {
  const { logout } = useAuth();

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout onLogout={logout} />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="hr-directory" element={<HRDirectory />} />
            <Route path="hr-directory/create" element={<HRDirectoryCreate />} />
            <Route path="hr-directory/edit/:id" element={<HRDirectoryCreate />} />
            <Route path="resumes" element={<MyResumes />} />
            {/* <Route path="send-applications" element={<SendApplications />} /> */}
            <Route path="templates" element={<MessageTemplate />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer />
      <PWAInstallPrompt />
    </>
  );
}

export default App;
