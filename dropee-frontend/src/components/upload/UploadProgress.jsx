import React from 'react';

const UploadProgress = ({ progress }) => {
  if (progress === 0 || progress === null) return null;

  return (
    <div className="mt-4 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-text-muted font-medium">Uploading...</span>
        <span className="text-sm font-bold text-accent-primary">{progress}%</span>
      </div>
      <div className="w-full bg-bg-card rounded-full h-2.5 overflow-hidden border border-gray-700">
        <div
          className="bg-gradient-to-r from-accent-primary to-red-400 h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      {progress === 100 && (
        <p className="text-success text-sm mt-2 text-center font-medium animate-fade-in">
          ✅ Upload complete!
        </p>
      )}
    </div>
  );
};

export default UploadProgress;
