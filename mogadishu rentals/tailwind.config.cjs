/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './App.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#13ec6a',
        'primary-dark': '#0fb350',
        'background-light': '#f8fcfa',
        'background-dark': '#102217',
        'surface-light': '#ffffff',
        'surface-dark': '#1a3324',
        'text-main-light': '#0d1b13',
        'text-main-dark': '#e0e7e3',
        'text-sub-light': '#5c6f64',
        'text-sub-dark': '#9aaead',
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Noto Sans', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
};