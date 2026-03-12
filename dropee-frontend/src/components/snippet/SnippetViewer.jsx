import React, { useState } from 'react';

const SnippetViewer = ({ snippet }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const el = document.createElement('textarea');
      el.value = snippet.text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const languageColors = {
    JavaScript: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    TypeScript: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    Python: 'bg-green-500/20 text-green-300 border-green-500/30',
    HTML: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    CSS: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    JSON: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    Bash: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    'Plain Text': 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  };

  const badgeClass = languageColors[snippet.language] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <span className="text-xl">📋</span>
          <div>
            <h2 className="font-bold text-white text-lg">{snippet.title}</h2>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${badgeClass} mt-0.5 inline-block`}>
              {snippet.language || 'Plain Text'}
            </span>
          </div>
        </div>
        <button
          onClick={copy}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
            ${copied ? 'bg-success text-white' : 'bg-accent-primary text-white hover:bg-red-600'}`}
        >
          {copied ? '✅ Copied!' : '📋 Copy'}
        </button>
      </div>

      {/* Code block */}
      <div className="p-5 overflow-x-auto">
        <pre className="font-mono text-sm text-text-primary leading-relaxed whitespace-pre-wrap break-all">
          <code>{snippet.text}</code>
        </pre>
      </div>
    </div>
  );
};

export default SnippetViewer;
