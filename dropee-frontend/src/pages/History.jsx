import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../config';
import storeUser from '../utils/storeUser';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Toast from '../components/ui/Toast';
import FetchingScreen from '../components/ui/FetchingScreen';
import HistoryList from '../components/history/HistoryList';
import useStore from '../store/useStore';

const History = () => {
  const addToast = useStore((s) => s.addToast);
  const userId = storeUser();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['history', userId],
    queryFn: async () => {
      const res = await axios.get(`${baseUrl}api/v1/history/${userId}`);
      return res.data.history;
    },
    retry: false,
    staleTime: 60 * 1000,
  });

  const handleClear = () => {
    addToast({ type: 'info', message: 'History is stored on the server and clears automatically.' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <Link to="/" className="text-text-muted hover:text-accent-primary text-sm flex items-center gap-1 mb-4 transition-colors">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-white">📜 Transfer History</h1>
          <p className="text-text-muted mt-1">Your recent file and snippet transfers</p>
        </div>

        {isLoading && <FetchingScreen message="Loading history..." />}

        {isError && (
          <div className="text-center py-12 glass-card">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-text-muted">Could not load history. Try again later.</p>
            <button
              onClick={refetch}
              className="btn-ghost border border-gray-600 mt-4 py-2 px-4 rounded-xl text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {data && <HistoryList history={data} onClear={handleClear} />}
      </main>

      <Footer />
      <Toast />
    </div>
  );
};

export default History;
