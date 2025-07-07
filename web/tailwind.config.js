/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',         // enable class-based dark mode
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#3b82f6',   // blue-500
          DEFAULT: '#2563eb', // blue-600
          dark: '#1d4ed8',    // blue-700
        },
        accent: '#f472b6',    // pink-400
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif']  // add a sleek system font
      }
    },
  },
  plugins: [],
}
