import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ShipsProvider } from './contexts/ShipsContext';
import { ComponentsProvider } from './contexts/ComponentsContext';
import { JobsProvider } from './contexts/JobsContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import ProtectedRoute from './components/Authentication/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ShipsPage from './pages/ShipsPage';
import ShipDetailPage from './pages/ShipDetailPage';
import JobsPage from './pages/JobsPage';
import CalendarPage from './pages/CalendarPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationsProvider>
          <ShipsProvider>
            <ComponentsProvider>
              <JobsProvider>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/ships" element={
                    <ProtectedRoute>
                      <ShipsPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/ships/:shipId" element={
                    <ProtectedRoute>
                      <ShipDetailPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/jobs" element={
                    <ProtectedRoute>
                      <JobsPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/calendar" element={
                    <ProtectedRoute>
                      <CalendarPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </JobsProvider>
            </ComponentsProvider>
          </ShipsProvider>
        </NotificationsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;