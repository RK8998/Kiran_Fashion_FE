import { createBrowserRouter } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

import DefaultLayout from '@/layouts/default';
import Home from '@/pages/Home';
import Users from '@/pages/Users';
import Notes from '@/pages/Notes';
import Products from '@/pages/Products';
import Sales from '@/pages/Sales';
import LoginPage from '@/pages/Auth/Login';
import AddEditNotes from '@/pages/Notes/AddEditNotes';
import AddEditProduct from '@/pages/Products/AddEditProduct';
import ViewNote from '@/pages/Notes/ViewNote';
import ViewUser from '@/pages/Users/ViewUser';
import AddEditUser from '@/pages/Users/AddEditUser';
import ChangePassword from '@/pages/Users/ChangePassword';
import ViewProduct from '@/pages/Products/ViewProduct';
import AddEditSales from '@/pages/Sales/AddEditSales';
import ViewSales from '@/pages/Sales/ViewSales';
import { RouterErrorElement } from '@/pages/ErrorBoundary/RouterErrorElement';
import { PageNotFound } from '@/pages/Auth/PageNotFound';
import { ROLES } from '@/constants';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    // errorElement: <RouterErrorElement />,
    hasErrorBoundary: true,
    ErrorBoundary: RouterErrorElement,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute allowedRoles={[ROLES.admin, ROLES.user]} path="/">
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: 'users',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.admin]} path="users">
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: 'users/:id',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.admin]} path="users/:id">
            <ViewUser />
          </ProtectedRoute>
        ),
      },
      {
        path: 'users/add',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.admin]} path="users/add">
            <AddEditUser />
          </ProtectedRoute>
        ),
      },
      {
        path: 'users/edit/:id',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.admin]} path="users/edit/:id">
            <AddEditUser />
          </ProtectedRoute>
        ),
      },
      {
        path: 'users/change-password/:id',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.admin]} path="users/change-password/:id">
            <ChangePassword />
          </ProtectedRoute>
        ),
      },
      {
        path: 'products',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.admin, ROLES.user]} path="products">
            <Products />
          </ProtectedRoute>
        ),
      },
      {
        path: 'products/:id',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.admin, ROLES.user]} path="products/:id">
            <ViewProduct />
          </ProtectedRoute>
        ),
      },
      {
        path: 'products/add',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.admin, ROLES.user]} path="products/add">
            <AddEditProduct />
          </ProtectedRoute>
        ),
      },
      {
        path: 'products/edit/:id',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.admin, ROLES.user]} path="products/edit/:id">
            <AddEditProduct />
          </ProtectedRoute>
        ),
      },
      {
        path: 'sales',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.admin, ROLES.user]} path="sales">
            <Sales />
          </ProtectedRoute>
        ),
      },
      {
        path: 'sales/:id',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.admin, ROLES.user]} path="sales/:id">
            <ViewSales />
          </ProtectedRoute>
        ),
      },
      {
        path: 'sales/add',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.admin, ROLES.user]} path="sales/add">
            <AddEditSales />
          </ProtectedRoute>
        ),
      },
      {
        path: 'sales/edit/:id',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.admin, ROLES.user]} path="sales/edit/:id">
            <AddEditSales />
          </ProtectedRoute>
        ),
      },
      {
        path: 'notes',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.admin, ROLES.user]} path="notes">
            <Notes />
          </ProtectedRoute>
        ),
      },
      {
        path: 'notes/:id',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.admin, ROLES.user]} path="notes/:id">
            <ViewNote />
          </ProtectedRoute>
        ),
      },
      {
        path: 'notes/add',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.admin, ROLES.user]} path="notes/add">
            <AddEditNotes />
          </ProtectedRoute>
        ),
      },
      {
        path: 'notes/edit/:id',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.admin, ROLES.user]} path="notes/edit/:id">
            <AddEditNotes />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  { path: '*', element: <PageNotFound /> },
]);
