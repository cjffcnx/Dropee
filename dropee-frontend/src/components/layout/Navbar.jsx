import { useState } from 'react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useInstallPrompt from '../../hooks/useInstallPrompt';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const {
    canInstall,
    canShowIosHint,
    isInstalled,
    promptInstall,
    showIosHint,
    dismissIosHint,
  } = useInstallPrompt();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/snippet', label: 'Snippet' },
    { to: '/history', label: 'History' },
  ];

  const isActive = (path) =>
    location.pathname === path
      ? 'text-accent-primary font-semibold'
      : 'text-text-muted hover:text-text-primary';

  const showInstallButton = canInstall || canShowIosHint;

  return (
    <nav className="sticky top-0 z-50 bg-bg-secondary/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl">💧</span>
            <div>
              <span className="text-xl font-bold text-white tracking-wider">Dropee</span>
              <p className="text-xs text-text-muted leading-none hidden sm:block">Drop it. Share it.</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm transition-colors duration-200 ${isActive(link.to)}`}
              >
                {link.label}
              </Link>
            ))}
            {showInstallButton && (
              <button
                type="button"
                onClick={promptInstall}
                className="btn-primary py-2 px-4 text-sm"
              >
                Install App
              </button>
            )}
            {isInstalled && (
              <span className="text-xs font-semibold text-green-400">Installed</span>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-text-muted hover:text-white p-2 rounded-lg"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block py-2 px-4 text-sm rounded-lg mb-1 transition-colors ${isActive(link.to)}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {showInstallButton && (
              <button
                type="button"
                onClick={promptInstall}
                className="w-full text-left btn-primary py-2 px-4 text-sm mt-2"
              >
                Install App
              </button>
            )}
            {isInstalled && (
              <p className="px-4 pt-2 text-xs font-semibold text-green-400">App installed</p>
            )}
          </div>
        )}

        {showIosHint && (
          <div className="mb-4 rounded-xl border border-gray-700 bg-bg-card/90 px-4 py-3 text-sm text-text-muted">
            <div className="flex items-start justify-between gap-4">
              <p>
                Install on iPhone: tap the Share button in Safari, then choose <span className="text-text-primary font-semibold">Add to Home Screen</span>.
              </p>
              <button
                type="button"
                onClick={dismissIosHint}
                className="text-text-muted hover:text-white"
                aria-label="Dismiss install help"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
