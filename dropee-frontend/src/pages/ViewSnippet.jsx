import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { baseUrl } from '../config';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Toast from '../components/ui/Toast';
import FetchingScreen from '../components/ui/FetchingScreen';
import NotFound from '../components/ui/NotFound';
import SnippetViewer from '../components/snippet/SnippetViewer';

const ViewSnippet = () => {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['snippet', id],
    queryFn: async () => {
      const res = await axios.get(`${baseUrl}api/v1/code/${id}`);
      return res.data.snippet;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <Link to="/" className="text-text-muted hover:text-accent-primary text-sm flex items-center gap-1 mb-4 transition-colors">
            ← Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-white">📋 Shared Snippet</h1>
        </div>

        {isLoading && <FetchingScreen message="Loading snippet..." />}

        {isError && (
          <NotFound message="This snippet doesn't exist or has expired (snippets expire after 30 days)." />
        )}

        {data && (
          <>
            <SnippetViewer snippet={data} />
            <div className="flex gap-3 mt-6">
              <Link to="/snippet" className="btn-primary inline-flex items-center gap-2">
                + Share New Snippet
              </Link>
              <Link to="/" className="btn-ghost border border-gray-600 inline-flex items-center gap-2 py-2.5 px-5 rounded-xl text-sm font-medium">
                ← Home
              </Link>
            </div>
          </>
        )}
      </main>

      <Footer />
      <Toast />
    </div>
  );
};

export default ViewSnippet;
