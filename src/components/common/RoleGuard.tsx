import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useLearningStore } from '../../context/LearningStoreContext';
import type { UserRole } from '../../types/auth';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const location = useLocation();
  const { currentUser, isAuthenticated } = useLearningStore();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // If authenticated user tries to access a role branch they don't have access to, redirect to their home portal
    if (currentUser.role === 'teacher') {
      return <Navigate to="/teacher" replace />;
    }
    return <Navigate to="/student/dashboard" replace />;
  }

  return <>{children}</>;
};
