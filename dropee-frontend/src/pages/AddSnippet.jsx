import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../config';
import storeUser from '../utils/storeUser';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Toast from '../components/ui/Toast';
import Button from '../components/ui/Button';
import SnippetEditor from '../components/snippet/SnippetEditor';
import useStore from '../store/useStore';

const AddSnippet = () => {
  const navigate = useNavigate();
  const addToast = useStore((s) => s.addToast);

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('Plain Text');
  const [loading, setLoading] = useState(false);

  const handleShare = async () => {
    if (!title.trim() || !text.trim()) {
      addToast({ type: 'warning', message: 'Title and content are required.' });
      return;
    }

    const userId = storeUser();
    setLoading(true);

    try {
      const response = await axios.post(`${baseUrl}api/v1/code`, {
        title: title.trim(),
        text: text.trim(),
        language,
        userId,
      });

      if (response.data.status === 200) {
        addToast({ type: 'success', title: 'Snippet shared!', message: 'Redirecting to your snippet...' });
        navigate(`/snippet/${response.data.id}`);
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create snippet.';
      addToast({ type: 'error', title: 'Error', message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <Link to="/" className="text-text-muted hover:text-accent-primary text-sm flex items-center gap-1 mb-4 transition-colors">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-white">📋 Share a Snippet</h1>
          <p className="text-text-muted mt-1">Share code or text without any login. Expires in 30 days.</p>
        </div>

        <div className="glass-card p-6">
          <SnippetEditor
            title={title}
            setTitle={setTitle}
            text={text}
            setText={setText}
            language={language}
            setLanguage={setLanguage}
          />

          <div className="flex gap-3 mt-6">
            <Link to="/" className="btn-ghost border border-gray-600 py-2.5 px-5 rounded-xl text-sm font-medium">
              Cancel
            </Link>
            <Button
              onClick={handleShare}
              loading={loading}
              disabled={loading || !title.trim() || !text.trim()}
              size="lg"
              className="flex-1"
            >
              🚀 Share Snippet
            </Button>
          </div>
        </div>
      </main>

      <Footer />
      <Toast />
    </div>
  );
};

export default AddSnippet;
