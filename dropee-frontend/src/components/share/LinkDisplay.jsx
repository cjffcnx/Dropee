import React, { useState } from 'react';

const LinkDisplay = ({ userId, downloadLinks }) => {
  const [copied, setCopied] = useState(false);
  const shareLink = `${window.location.origin}/${userId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const el = document.createElement('textarea');
      el.value = shareLink;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!userId) return null;

  return (
    <div className="mt-6 glass-card p-5 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-success text-lg">✅</span>
        <h3 className="font-semibold text-white">Files uploaded! Share this link:</h3>
      </div>

      <div className="flex items-center gap-2 bg-bg-secondary rounded-xl px-4 py-3 border border-gray-700 mb-4">
        <span className="flex-1 text-text-primary text-sm font-mono truncate">{shareLink}</span>
        <button
          onClick={copyToClipboard}
          className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
            ${copied ? 'bg-success text-white' : 'bg-accent-primary text-white hover:bg-red-600'}`}
        >
          {copied ? '✅ Copied!' : '📋 Copy'}
        </button>
      </div>

      {downloadLinks && downloadLinks.length > 0 && (
        <div>
          <p className="text-xs text-text-muted mb-2">Direct download links:</p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {downloadLinks.map((link, i) => (
              <a
                key={i}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-accent-primary hover:text-red-400 truncate transition-colors"
              >
                📄 {link}
              </a>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-text-muted mt-3">
        ⏰ This link expires in <strong className="text-text-primary">15 days</strong>
      </p>
    </div>
  );
};

export default LinkDisplay;
