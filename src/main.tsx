import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import App from './App.tsx';
import GlobalContextProvider from './context/GlobalContext.tsx';
import { Provider } from './provider.tsx';
import '@/styles/globals.css';

const showQueryDevTools = import.meta.env.VITE_SHOW_QUERY_DEVTOOLS;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: true,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider>
      <GlobalContextProvider>
        <QueryClientProvider client={queryClient}>
          <App />
          {showQueryDevTools === 'true' && <ReactQueryDevtools />}
        </QueryClientProvider>
      </GlobalContextProvider>
    </Provider>
  </React.StrictMode>
);
