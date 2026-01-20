import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute: Guards routes to ensure user is authenticated and onboarded
 * - If not authenticated: redirect to /login
 * - If authenticated but not onboarded: redirect to /setup
 * - If authenticated and onboarded: render the component
 */
function ProtectedRoute({ 
  isAuthenticated, 
  isOnboarded, 
  children,
  routeName = 'protected route'
}) {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!isOnboarded) {
    return <Navigate to="/setup" replace />;
  }

  return children;
}

export default ProtectedRoute;
