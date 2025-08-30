import { RouterProvider } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useContext, useEffect } from 'react';

import { router } from './routes';
import { GlobalContext } from './context/GlobalContext';
import FullPageLoader from './components/FullPageLoader';
import { getLoggedInUserService } from './services/user';
import { AUTH_TOKEN, localStorageHandler } from './helpers/storage';

// const showQueryDevTools = import.meta.env.VITE_SHOW_QUERY_DEVTOOLS;

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: 2,
//       refetchOnWindowFocus: true,
//     },
//   },
// });

function App() {
  const { saveLoggedInUser } = useContext(GlobalContext);
  const authToken = localStorageHandler('GET', AUTH_TOKEN);

  const { data: userData, isLoading } = useQuery({
    queryKey: ['logged-in-user'],
    queryFn: async () => {
      const params = {};
      const response = await getLoggedInUserService(params);

      if (response?.data?.success) {
        return response?.data?.data;
      } else return null;
    },
    enabled: Boolean(authToken),
  });

  useEffect(() => {
    if (userData) {
      saveLoggedInUser(userData);
    }
  }, [userData]);

  if (isLoading) {
    return (
      <FullPageLoader
        open={isLoading}
        subtext="Please be patients"
        text="Your Site getting ready..."
      />
    );
  }

  return (
    <>
      {/* <QueryClientProvider client={queryClient}> */}
      <RouterProvider router={router} />
      {/* {showQueryDevTools === 'true' && <ReactQueryDevtools />}
      </QueryClientProvider> */}
      <Toaster />
    </>
  );
}

export default App;
