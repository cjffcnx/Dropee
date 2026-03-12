import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-bg-secondary border-t border-gray-800 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">💧</span>
            <span className="text-white font-bold text-lg tracking-wider">Dropee</span>
            <span className="text-text-muted text-sm ml-2">— Drop it. Share it.</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-text-muted">
            <Link to="/" className="hover:text-accent-primary transition-colors">Home</Link>
            <Link to="/snippet" className="hover:text-accent-primary transition-colors">Snippet</Link>
            <Link to="/history" className="hover:text-accent-primary transition-colors">History</Link>
          </div>

          <p className="text-text-muted text-xs">
            © {new Date().getFullYear()} Dropee. Files expire in 15 days.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
