import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

import { AuthProvider } from './contexts/AuthContext';

root.render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </StrictMode>
);
