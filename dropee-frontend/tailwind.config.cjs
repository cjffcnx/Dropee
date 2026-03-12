/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0f0f23',
        'bg-secondary': '#1a1a2e',
        'bg-card': '#16213e',
        'accent-primary': '#e94560',
        'accent-secondary': '#0f3460',
        'text-primary': '#eaeaea',
        'text-muted': '#a0a0b0',
        'success': '#00b894',
        'error': '#e17055',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(233, 69, 96, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(233, 69, 96, 0.6)' },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(-8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
