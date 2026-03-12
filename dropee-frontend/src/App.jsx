import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoadingScreen from './components/ui/LoadingScreen';

const Home = lazy(() => import('./pages/Home'));
const AddSnippet = lazy(() => import('./pages/AddSnippet'));
const ViewSnippet = lazy(() => import('./pages/ViewSnippet'));
const ViewShared = lazy(() => import('./pages/ViewShared'));
const History = lazy(() => import('./pages/History'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/snippet" element={<AddSnippet />} />
            <Route path="/snippet/:id" element={<ViewSnippet />} />
            <Route path="/history" element={<History />} />
            <Route path="/:userId" element={<ViewShared />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
