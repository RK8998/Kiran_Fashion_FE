import { createBrowserRouter } from 'react-router-dom';

import DefaultLayout from '@/layouts/default';
import Home from '@/pages/Home';
import Users from '@/pages/Users';
import Notes from '@/pages/Notes';
import Products from '@/pages/Products';
import Sales from '@/pages/Sales';
import { RouterErrorElement } from '@/pages/ErrorBoundary/RouterErrorElement';
import { PageNotFound } from '@/pages/Auth/PageNotFound';
import LoginPage from '@/pages/Auth/Login';
import AddEditNotes from '@/pages/Notes/AddEditNotes';
import AddEditProduct from '@/pages/Products/AddEditProduct';
import ViewNote from '@/pages/Notes/ViewNote';
import ViewUser from '@/pages/Users/ViewUser';
import AddEditUser from '@/pages/Users/AddEditUser';
import ChangePassword from '@/pages/Users/ChangePassword';
import ViewProduct from '@/pages/Products/ViewProduct';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    errorElement: <RouterErrorElement />,
    hasErrorBoundary: true,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'users',
        element: <Users />,
      },
      {
        path: 'users/:id',
        element: <ViewUser />,
      },
      {
        path: 'users/add',
        element: <AddEditUser />,
      },
      {
        path: 'users/edit/:id',
        element: <AddEditUser />,
      },
      {
        path: 'users/change-password/:id',
        element: <ChangePassword />,
      },
      {
        path: 'products',
        element: <Products />,
      },
      {
        path: 'products/:id',
        element: <ViewProduct />,
      },
      { path: 'products/add', element: <AddEditProduct /> },
      {
        path: 'products/edit/:id',
        element: <AddEditProduct />,
      },
      {
        path: 'sales',
        element: <Sales />,
      },
      {
        path: 'notes',
        element: <Notes />,
      },
      { path: 'notes/:id', element: <ViewNote /> },
      { path: 'notes/add', element: <AddEditNotes /> },
      { path: 'notes/edit/:id', element: <AddEditNotes /> },
    ],
  },
  { path: '/login', element: <LoginPage /> },
  { path: '*', element: <PageNotFound /> },
]);
