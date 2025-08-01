import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Store
import { useAuthStore } from '@store/authStore';
import { useThemeStore } from '@store/themeStore';

// Components
import LoadingScreen from '@components/ui/LoadingScreen';
import ErrorBoundary from '@components/ui/ErrorBoundary';
import Layout from '@components/layout/Layout';
import AdminLayout from '@components/layout/AdminLayout';

// Pages
import HomePage from '@pages/HomePage';
import LoginPage from '@pages/auth/LoginPage';
import RegisterPage from '@pages/auth/RegisterPage';
import DashboardPage from '@pages/DashboardPage';
import GameEditorPage from '@pages/editor/GameEditorPage';
import ProjectsPage from '@pages/ProjectsPage';
import MarketplacePage from '@pages/MarketplacePage';
import ProfilePage from '@pages/ProfilePage';
import SubscriptionPage from '@pages/SubscriptionPage';
import AdminDashboard from '@pages/admin/AdminDashboard';
import AdminUsers from '@pages/admin/AdminUsers';
import AdminProjects from '@pages/admin/AdminProjects';
import AdminAnalytics from '@pages/admin/AdminAnalytics';
import AdminSettings from '@pages/admin/AdminSettings';
import NotFoundPage from '@pages/NotFoundPage';

// Hooks
import { useSocket } from '@hooks/useSocket';

// Services
import { authService } from '@services/authService';

// Styles
import '@styles/globals.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Admin Route Component
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || (user && user.role !== 'admin' && !user.isAdmin)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
};

// Public Route Component (redirect if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  const { initializeAuth, isLoading } = useAuthStore();
  const { theme, initializeTheme } = useThemeStore();
  const { initializeSocket } = useSocket();

  useEffect(() => {
    // Initialize theme
    initializeTheme();
    
    // Initialize authentication
    initializeAuth();
    
    // Initialize socket connection
    initializeSocket();
  }, [initializeAuth, initializeTheme, initializeSocket]);

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Router>
          <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
            <AnimatePresence mode="wait">
              <Routes>
                {/* Public Routes */}
                <Route
                  path="/"
                  element={
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <HomePage />
                    </motion.div>
                  }
                />
                
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <LoginPage />
                      </motion.div>
                    </PublicRoute>
                  }
                />
                
                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <RegisterPage />
                      </motion.div>
                    </PublicRoute>
                  }
                />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Suspense fallback={<LoadingScreen />}>
                          <DashboardPage />
                        </Suspense>
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/editor/:projectId?"
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingScreen />}>
                        <GameEditorPage />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/projects"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Suspense fallback={<LoadingScreen />}>
                          <ProjectsPage />
                        </Suspense>
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/marketplace"
                  element={
                    <Layout>
                      <Suspense fallback={<LoadingScreen />}>
                        <MarketplacePage />
                      </Suspense>
                    </Layout>
                  }
                />

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Suspense fallback={<LoadingScreen />}>
                          <ProfilePage />
                        </Suspense>
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/subscription"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Suspense fallback={<LoadingScreen />}>
                          <SubscriptionPage />
                        </Suspense>
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />

                <Route
                  path="/admin/users"
                  element={
                    <AdminRoute>
                      <AdminUsers />
                    </AdminRoute>
                  }
                />

                <Route
                  path="/admin/projects"
                  element={
                    <AdminRoute>
                      <AdminProjects />
                    </AdminRoute>
                  }
                />

                <Route
                  path="/admin/analytics"
                  element={
                    <AdminRoute>
                      <AdminAnalytics />
                    </AdminRoute>
                  }
                />

                <Route
                  path="/admin/settings"
                  element={
                    <AdminRoute>
                      <AdminSettings />
                    </AdminRoute>
                  }
                />

                {/* 404 Route */}
                <Route
                  path="*"
                  element={
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <NotFoundPage />
                    </motion.div>
                  }
                />
              </Routes>
            </AnimatePresence>

            {/* Global Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: theme === 'dark' ? '#374151' : '#ffffff',
                  color: theme === 'dark' ? '#ffffff' : '#111827',
                  border: '1px solid',
                  borderColor: theme === 'dark' ? '#4B5563' : '#E5E7EB',
                },
                success: {
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#ffffff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#ffffff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;