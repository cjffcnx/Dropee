import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = ({ message = 'Nothing found here.' }) => {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="text-center glass-card p-10 max-w-md w-full mx-4">
        <div className="text-7xl mb-4">⏰</div>
        <h2 className="text-2xl font-bold text-white mb-2">Not Found</h2>
        <p className="text-text-muted mb-6">{message}</p>
        <Link
          to="/"
          className="btn-primary inline-flex items-center gap-2"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
