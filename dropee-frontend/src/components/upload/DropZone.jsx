import React, { useCallback, useState } from 'react';

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

const DropZone = ({ files, onFilesChange }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0) {
        onFilesChange([...files, ...droppedFiles]);
      }
    },
    [files, onFilesChange]
  );

  const handleFileInput = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length > 0) {
      onFilesChange([...files, ...selected]);
    }
    e.target.value = '';
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
        ${isDragOver
          ? 'drag-over border-accent-primary bg-accent-primary/10'
          : 'border-gray-600 hover:border-accent-primary bg-bg-card hover:bg-accent-primary/5'
        }
      `}
      onClick={() => document.getElementById('file-input').click()}
    >
      <input
        id="file-input"
        type="file"
        multiple
        accept="*"
        className="hidden"
        onChange={handleFileInput}
      />

      <div className="flex flex-col items-center gap-4">
        <div className={`text-6xl transition-transform duration-300 ${isDragOver ? 'scale-110' : ''}`}>
          {isDragOver ? '📂' : '📤'}
        </div>

        <div>
          <p className="text-xl font-semibold text-text-primary mb-2">
            {isDragOver ? 'Release to drop files!' : 'Drop files here'}
          </p>
          <p className="text-text-muted text-sm">
            or <span className="text-accent-primary font-medium">click to browse</span>
          </p>
          <p className="text-text-muted text-xs mt-2">
            Any file type • Up to 100MB per file • Up to 20 files
          </p>
        </div>

        {files.length === 0 && (
          <div className="flex gap-3 mt-2 flex-wrap justify-center">
            {['📦 ZIP', '🖼️ Images', '📄 PDFs', '📝 Text', '🐍 Code'].map((type) => (
              <span key={type} className="text-xs bg-bg-secondary text-text-muted px-3 py-1 rounded-full border border-gray-700">
                {type}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DropZone;
