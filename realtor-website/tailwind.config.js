/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        ink:   '#0f1419',
        paper: '#f6f2ea',
        gold:  '#9c8252'
      },
      letterSpacing: {
        brand: '0.32em'
      }
    }
  },
  plugins: []
};
