import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';

import { AUTH_TOKEN, localStorageHandler } from '@/helpers/storage';
import { GlobalContext } from '@/context/GlobalContext';
import { Unauthorized } from '@/pages/Auth/Unauthorized';

interface ProtectedRouteProps {
  children: React.ReactElement;
  path?: string;
  allowedRoles?: string[]; // pass which roles can access this route
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const authToken = localStorageHandler('GET', AUTH_TOKEN);
  const { user } = useContext(GlobalContext);

  if (!authToken) {
    return <Navigate replace to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // return <Navigate to="/" replace />; // redirect unauthorized users to home
    return <Unauthorized />;
  }

  return children;
};

export default ProtectedRoute;
