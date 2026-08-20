import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import { Toaster } from 'sonner';
import App from './App';
import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <NuqsAdapter>
          <TooltipProvider delayDuration={250} skipDelayDuration={300}>
            <App />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: 'var(--ivory-deep)',
                  color: 'var(--ink)',
                  border: '1px solid var(--hairline)',
                  fontFamily: 'var(--font-body)',
                },
              }}
            />
          </TooltipProvider>
        </NuqsAdapter>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

