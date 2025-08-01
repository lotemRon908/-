import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

// Pages
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import GameEditorPage from './pages/GameEditorPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import SettingsPage from './pages/SettingsPage';
import MarketplacePage from './pages/MarketplacePage';

// Components
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Store
import { useAuthStore } from './stores/authStore';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen bg-secondary-50">
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#1e293b',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              },
            }}
          />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/editor/:gameId?" element={
              <ProtectedRoute>
                <AppLayout>
                  <GameEditorPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/marketplace" element={
              <ProtectedRoute>
                <AppLayout>
                  <MarketplacePage />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <AppLayout>
                  <SettingsPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <AppLayout>
                  <AdminPage />
                </AppLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  );
}

// App Layout Component
function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-secondary-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default App;