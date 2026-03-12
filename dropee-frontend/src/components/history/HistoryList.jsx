import React from 'react';
import { Link } from 'react-router-dom';
import formatFileSize from '../../utils/formatFileSize';

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

const HistoryList = ({ history, onClear }) => {
  if (!history || history.length === 0) {
    return (
      <div className="text-center py-16 glass-card">
        <div className="text-6xl mb-4">📭</div>
        <p className="text-text-muted text-lg">No transfer history yet.</p>
        <p className="text-text-muted text-sm mt-2">Start by uploading files or sharing a snippet!</p>
        <Link to="/" className="btn-primary inline-flex mt-6">
          Upload Files
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-text-muted text-sm">{history.length} transfer{history.length > 1 ? 's' : ''}</p>
        {onClear && (
          <button onClick={onClear} className="text-error text-sm hover:text-red-400 transition-colors flex items-center gap-1">
            🗑️ Clear History
          </button>
        )}
      </div>

      <div className="space-y-3">
        {history.map((entry) => (
          <div key={entry._id || entry.refId} className="glass-card p-4 flex items-center gap-4 hover:border-accent-primary/30 transition-all group">
            <span className="text-2xl flex-shrink-0">
              {entry.type === 'code' ? '📋' : getFileIcon(entry.title)}
            </span>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`text-xs px-2 py-0.5 rounded-full ${entry.type === 'code' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'}`}>
                  {entry.type === 'code' ? 'Snippet' : 'File'}
                </span>
              </div>
              <p className="font-medium text-text-primary truncate text-sm">{entry.title}</p>
              <p className="text-xs text-text-muted mt-0.5">
                {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                }) : ''}
              </p>
            </div>

            <a
              href={entry.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-primary hover:text-red-400 transition-colors flex-shrink-0 text-sm font-medium opacity-0 group-hover:opacity-100"
            >
              View →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;
