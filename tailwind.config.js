/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0FDF4',
          100: '#E6F7ED',
          200: '#C3E9D0',
          300: '#86D5A3',
          400: '#4ADE80',
          500: '#0c5b36',
          600: '#0a4d2e',
          700: '#083f26',
          800: '#06311e',
          900: '#042316',
          950: '#02150e'
        },
        dark: {
          50: '#F8F9FA',
          100: '#F1F3F4',
          200: '#E8EAED',
          300: '#DADCE0',
          400: '#80868B',
          500: '#5F6368',
          600: '#3C4043',
          700: '#202124',
          800: '#171717',
          900: '#0D1117',
          950: '#000000'
        }
      }
    }
  }
}