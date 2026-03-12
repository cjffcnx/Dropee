import React from 'react';
import formatFileSize from '../../utils/formatFileSize';

const getFileIcon = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  const icons = {
    pdf: '📄', zip: '📦', rar: '📦', '7z': '📦',
    jpg: '🖼️', jpeg: '🖼️', png: '🖼️', gif: '🖼️', webp: '🖼️', svg: '🖼️',
    mp4: '🎬', mov: '🎬', avi: '🎬', mkv: '🎬',
    mp3: '🎵', wav: '🎵', flac: '🎵',
    js: '📜', jsx: '📜', ts: '📜', tsx: '📜', py: '🐍',
    html: '🌐', css: '🎨', json: '📋',
    txt: '📝', md: '📝',
    doc: '📘', docx: '📘', xls: '📗', xlsx: '📗',
  };
  return icons[ext] || '📁';
};

const FileList = ({ files, onRemove }) => {
  if (files.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      <p className="text-sm text-text-muted font-medium">{files.length} file{files.length > 1 ? 's' : ''} selected</p>
      <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
        {files.map((file, idx) => (
          <div
            key={`${file.name}-${idx}`}
            className="flex items-center gap-3 bg-bg-card border border-gray-700 rounded-xl px-4 py-3 animate-fade-in group"
          >
            <span className="text-2xl flex-shrink-0">{getFileIcon(file.name)}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{file.name}</p>
              <p className="text-xs text-text-muted">{formatFileSize(file.size)}</p>
            </div>
            <button
              onClick={() => onRemove(idx)}
              className="text-text-muted hover:text-error transition-colors ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100"
              aria-label="Remove file"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;
