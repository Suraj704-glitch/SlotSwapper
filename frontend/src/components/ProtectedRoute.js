import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth(); // Get user AND isLoading

  // 1. Check if the AuthContext is still loading
  if (isLoading) {
    // Show a loading screen (or null) while we check for a token
    return <div>Loading...</div>;
  }

  // 2. After loading, check if there is a user
  if (!user) {
    // If no user, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // 3. If finished loading and there IS a user, show the page
  return <Outlet />;
};

export default ProtectedRoute;