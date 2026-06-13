/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  important: '#root',
  theme: {
    extend: {
      colors: {
        primary: '#1F3864',
        'primary-light': '#2F5496',
        'primary-dark': '#16294A',
      },
    },
  },
  plugins: [],
};
