import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from '@/components/layout';
import { HomePage } from '@/pages/HomePage';
import './App.css';

// Create a client for TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Main App component with routing and query provider
 */
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="app">
          <Header />
          <main className="app__main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/vacancy/:id" element={<HomePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
