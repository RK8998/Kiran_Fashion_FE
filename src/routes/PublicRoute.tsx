import React from 'react';
import { Navigate } from 'react-router-dom';

import { AUTH_TOKEN, localStorageHandler } from '@/helpers/storage';

interface PublicRouteProps {
  children: React.ReactElement;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const authToken = localStorageHandler('GET', AUTH_TOKEN);

  if (authToken) {
    return <Navigate replace to="/" />;
  }

  return children;
};

export default PublicRoute;
