import { createBrowserRouter } from 'react-router-dom';

import DefaultLayout from '@/layouts/default';
import Home from '@/pages/Home';
import Users from '@/pages/Users';
import Notes from '@/pages/Notes';
import Products from '@/pages/Products';
import Sales from '@/pages/Sales';
import { RouterErrorElement } from '@/pages/ErrorBoundary/RouterErrorElement';
import { PageNotFound } from '@/pages/Auth/PageNotFound';

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
        path: 'products',
        element: <Products />,
      },
      {
        path: 'sales',
        element: <Sales />,
      },
      {
        path: 'notes',
        element: <Notes />,
      },
    ],
  },
  { path: '*', element: <PageNotFound /> },
]);
