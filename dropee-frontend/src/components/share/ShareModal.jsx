import React, { useState } from 'react';

const ShareModal = ({ isOpen, onClose, onSend }) => {
  const [mode, setMode] = useState('email');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!value.trim()) return;
    setLoading(true);
    await onSend(mode, value.trim());
    setLoading(false);
    setValue('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card p-6 w-full max-w-md animate-fade-in">
        <h3 className="text-lg font-bold text-white mb-4">Share via</h3>

        {/* Toggle */}
        <div className="flex bg-bg-secondary rounded-xl p-1 mb-4">
          {['email', 'phone'].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize
                ${mode === m ? 'bg-accent-primary text-white' : 'text-text-muted hover:text-white'}`}
            >
              {m === 'email' ? '📧 Email' : '📱 Phone'}
            </button>
          ))}
        </div>

        <input
          type={mode === 'email' ? 'email' : 'tel'}
          placeholder={mode === 'email' ? 'recipient@example.com' : '+1234567890'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="input-field mb-4"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 btn-ghost border border-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!value.trim() || loading}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send 📤'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
