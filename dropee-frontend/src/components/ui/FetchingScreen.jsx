import React from 'react';

const FetchingScreen = ({ message = 'Fetching data...' }) => {
  return (
    <div className="flex-1 flex items-center justify-center py-20">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-accent-secondary rounded-full animate-ping opacity-30" />
          <div className="absolute inset-2 border-4 border-accent-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-text-muted">{message}</p>
      </div>
    </div>
  );
};

export default FetchingScreen;
