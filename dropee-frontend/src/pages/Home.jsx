import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useStore from '../store/useStore';
import storeUser from '../utils/storeUser';
import { baseUrl } from '../config';
import DropZone from '../components/upload/DropZone';
import FileList from '../components/upload/FileList';
import UploadProgress from '../components/upload/UploadProgress';
import LinkDisplay from '../components/share/LinkDisplay';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Toast from '../components/ui/Toast';
import Button from '../components/ui/Button';
import useOfflineQueue, { addToQueue } from '../hooks/useOfflineQueue';

const Home = () => {
  const navigate = useNavigate();
  const {
    files, setFiles,
    progress, setProgress,
    loading, setLoading,
    userId, setUserId,
    addToast,
    uploadResult, setUploadResult,
  } = useStore();

  const [recipient, setRecipient] = useState('');
  const [searchId, setSearchId] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Initialize userId
  useEffect(() => {
    const id = storeUser();
    setUserId(id);
  }, []);

  // Online/offline tracking
  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  useOfflineQueue((result) => {
    addToast({ type: 'success', title: 'Offline Upload Synced!', message: 'Your queued files have been uploaded.' });
  });

  const removeFile = (idx) => {
    setFiles(files.filter((_, i) => i !== idx));
  };

  const detectRecipientType = (value) => {
    if (!value.trim()) return {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(value)) return { email: value };
    return { phone: value };
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      addToast({ type: 'warning', message: 'Please select at least one file to upload.' });
      return;
    }

    if (!isOnline) {
      // Queue offline
      await addToQueue({ userId, files, ...detectRecipientType(recipient) });
      addToast({ type: 'info', title: 'Offline Mode', message: 'Files queued. They will upload when you are back online.' });
      return;
    }

    setLoading(true);
    setProgress(0);
    setUploadResult(null);

    const formData = new FormData();
    formData.append('userId', userId);
    files.forEach((file) => formData.append('files', file));

    const recipientData = detectRecipientType(recipient);
    if (recipientData.email) formData.append('email', recipientData.email);
    if (recipientData.phone) formData.append('phone', recipientData.phone);

    try {
      const response = await axios.post(`${baseUrl}api/v1/files/sendFile`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded * 100) / (e.total || 1));
          setProgress(pct);
        },
      });

      if (response.data.status === 200) {
        setUploadResult(response.data);
        setFiles([]);
        setRecipient('');
        addToast({ type: 'success', title: 'Upload successful!', message: 'Your files are ready to share.' });
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Upload failed. Please try again.';
      addToast({ type: 'error', title: 'Upload failed', message });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const trimmed = searchId.trim().toUpperCase();
    if (trimmed.length === 6) {
      navigate(`/${trimmed}`);
    } else {
      addToast({ type: 'warning', message: 'Please enter a valid 6-character ID.' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar />

      {/* Offline banner */}
      {!isOnline && (
        <div className="bg-yellow-500/20 border-b border-yellow-500/30 text-yellow-300 text-center py-2 px-4 text-sm font-medium">
          📵 You are offline. Files will be queued and uploaded when reconnected.
        </div>
      )}

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">
            💧 <span className="bg-gradient-to-r from-accent-primary to-red-400 bg-clip-text text-transparent">Dropee</span>
          </h1>
          <p className="text-text-muted text-lg">Drop it. Share it. No login required.</p>
        </div>

        {/* Drop Zone */}
        <div className="glass-card p-6">
          <DropZone files={files} onFilesChange={setFiles} />
          <FileList files={files} onRemove={removeFile} />
          <UploadProgress progress={progress} />

          {/* Recipient input */}
          <div className="mt-4 space-y-3">
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="📧 Email or 📱 phone (optional) — to notify recipient"
              className="input-field text-sm"
            />

            <div className="flex gap-3">
              <Button
                onClick={handleUpload}
                disabled={loading || files.length === 0}
                loading={loading}
                size="lg"
                className="flex-1"
              >
                {isOnline ? '🚀 Upload & Share' : '📥 Queue Upload'}
              </Button>
            </div>
          </div>

          {/* Link to snippet */}
          <p className="text-center text-sm text-text-muted mt-4">
            Want to share code or text?{' '}
            <a href="/snippet" className="text-accent-primary hover:underline font-medium">
              Share a Snippet →
            </a>
          </p>
        </div>

        {/* Upload result */}
        {uploadResult && (
          <LinkDisplay
            userId={uploadResult.userId}
            downloadLinks={uploadResult.downloadLinks}
          />
        )}

        {/* Search section */}
        <div className="mt-8 glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-3">🔍 View Shared Files</h2>
          <p className="text-text-muted text-sm mb-4">Enter a 6-character share ID to view files someone shared with you.</p>
          <div className="flex gap-3">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value.toUpperCase().slice(0, 6))}
              placeholder="e.g. ABC123"
              className="input-field flex-1 font-mono tracking-widest text-center uppercase"
              maxLength={6}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} variant="secondary">
              View →
            </Button>
          </div>
        </div>
      </main>

      <Footer />
      <Toast />
    </div>
  );
};

export default Home;
