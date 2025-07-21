import { createBrowserRouter } from 'react-router-dom';

import DefaultLayout from '@/layouts/default';
import Home from '@/pages/Home';
import Notes from '@/pages/Notes';
import Products from '@/pages/Products';
import Sales from '@/pages/Sales';
import Users from '@/pages/Users';

import { AnimatedPage } from '@/components/AnimatedPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
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
]);
