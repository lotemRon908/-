import React, { useEffect, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Box, CircularProgress } from '@mui/material';

import { RootState, AppDispatch } from './store';
import { getCurrentUser } from './store/slices/authSlice';
import { useLoading } from './contexts/LoadingContext';

// Lazy loaded components
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const EditorPage = React.lazy(() => import('./pages/EditorPage'));
const ProjectPage = React.lazy(() => import('./pages/ProjectPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const MarketplacePage = React.lazy(() => import('./pages/MarketplacePage'));
const CommunityPage = React.lazy(() => import('./pages/CommunityPage'));
const AdminPage = React.lazy(() => import('./pages/AdminPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

// Components
import LoadingScreen from './components/LoadingScreen';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Loading fallback component
const PageLoadingFallback: React.FC = () => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    minHeight="100vh"
    bgcolor="background.default"
  >
    <CircularProgress size={60} />
  </Box>
);

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, token, isLoading } = useSelector((state: RootState) => state.auth);
  const { isGlobalLoading } = useLoading();

  // Initialize app
  useEffect(() => {
    if (token && !isAuthenticated) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token, isAuthenticated]);

  // Show loading screen during initialization
  if (isLoading && !isAuthenticated) {
    return <LoadingScreen />;
  }

  // Show global loading overlay
  if (isGlobalLoading) {
    return <LoadingScreen overlay />;
  }

  return (
    <>
      <Helmet>
        <title>GameCraft Pro Ultimate | פיתוח משחקים מתקדם</title>
        <meta name="description" content="סביבת פיתוח משחקים מהפכנית שמאפשרת לכל אחד ליצור משחקים מקצועיים ללא ידע תכנות מוקדם" />
        <meta name="keywords" content="פיתוח משחקים, משחקים, תכנות, AI, GameCraft, פיתוח ללא קוד" />
        <meta property="og:title" content="GameCraft Pro Ultimate" />
        <meta property="og:description" content="סביבת פיתוח משחקים מהפכנית" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <Suspense fallback={<PageLoadingFallback />}>
        <Routes>
          {/* Public routes */}
          <Route 
            path="/" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} 
          />
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} 
          />

          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          
          <Route path="/editor" element={
            <ProtectedRoute>
              <EditorPage />
            </ProtectedRoute>
          } />
          
          <Route path="/editor/:projectId" element={
            <ProtectedRoute>
              <EditorPage />
            </ProtectedRoute>
          } />
          
          <Route path="/project/:projectId" element={
            <ProtectedRoute>
              <ProjectPage />
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/marketplace" element={
            <ProtectedRoute>
              <MarketplacePage />
            </ProtectedRoute>
          } />
          
          <Route path="/community" element={
            <ProtectedRoute>
              <CommunityPage />
            </ProtectedRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          } />

          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;