/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f2ff',
          100: '#cce5ff',
          200: '#99c8ff',
          300: '#66a9ff',
          400: '#338bff',
          500: '#0F3460',
          600: '#0c2a4d',
          700: '#09203a',
          800: '#061526',
          900: '#030b13',
        },
        secondary: {
          50: '#e6f7ff',
          100: '#ccefff',
          200: '#99dfff',
          300: '#66d0ff',
          400: '#33c0ff',
          500: '#1A6299',
          600: '#154e7a',
          700: '#103b5c',
          800: '#0a273d',
          900: '#05141f',
        },
        accent: {
          50: '#fde9ed',
          100: '#fbd2da',
          200: '#f7a5b5',
          300: '#f37990',
          400: '#ef4c6b',
          500: '#E94560',
          600: '#ba374d',
          700: '#8c293a',
          800: '#5d1c26',
          900: '#2f0e13',
        },
        success: '#10B981',
        warning: '#FBBF24',
        error: '#EF4444',
        background: '#F3F4F6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        dropdown: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.4s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};