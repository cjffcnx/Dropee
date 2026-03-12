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
import formatFileSize from '../utils/formatFileSize';

const getFileIcon = (filename) => {
  const ext = (filename || '').split('.').pop().toLowerCase();
  const icons = {
    pdf: '📄', zip: '📦', rar: '📦', '7z': '📦',
    jpg: '🖼️', jpeg: '🖼️', png: '🖼️', gif: '🖼️', webp: '🖼️', svg: '🖼️',
    mp4: '🎬', mov: '🎬', avi: '🎬', mkv: '🎬',
    mp3: '🎵', wav: '🎵', flac: '🎵',
    js: '📜', jsx: '📜', ts: '📜', tsx: '📜', py: '🐍',
    html: '🌐', css: '🎨', json: '📋',
    txt: '📝', md: '📝',
  };
  return icons[ext] || '📁';
};

const ViewShared = () => {
  const { userId } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['shared-files', userId],
    queryFn: async () => {
      const res = await axios.get(`${baseUrl}api/v1/files/${userId}`);
      return res.data.files;
    },
    retry: false,
    staleTime: 2 * 60 * 1000,
  });

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <Link to="/" className="text-text-muted hover:text-accent-primary text-sm flex items-center gap-1 mb-4 transition-colors">
            ← Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">📁 Shared Files</h1>
            <span className="text-xs bg-bg-card text-text-muted px-3 py-1 rounded-full border border-gray-700 font-mono">
              {userId}
            </span>
          </div>
          <p className="text-text-muted text-sm mt-1">⏰ Files expire 15 days after upload</p>
        </div>

        {isLoading && <FetchingScreen message="Loading shared files..." />}

        {isError && (
          <NotFound message="No files found for this ID. They may have expired or the ID is invalid." />
        )}

        {data && data.length > 0 && (
          <div className="space-y-3">
            {data.map((file) => (
              <div
                key={file._id}
                className="glass-card p-4 flex items-center gap-4 hover:border-accent-primary/30 transition-all group"
              >
                <span className="text-3xl flex-shrink-0">{getFileIcon(file.originalName)}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{file.originalName}</p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {formatFileSize(file.size)} •{' '}
                    {file.createdAt ? new Date(file.createdAt).toLocaleDateString() : ''}
                  </p>
                </div>
                <a
                  href={file.downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="flex-shrink-0 btn-primary py-2 px-4 text-sm"
                >
                  ⬇️ Download
                </a>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
      <Toast />
    </div>
  );
};

export default ViewShared;
