/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ayur: {
          50: '#f4f8f3',
          100: '#e5efe3',
          200: '#cce0c8',
          300: '#a5caa0',
          400: '#76ac6e',
          500: '#528f4a',
          600: '#3f7338',
          700: '#335b2e',
          800: '#2c4927',
          900: '#253d22',
          950: '#10210f',
        },
        gold: {
          400: '#f59e0b',
          500: '#d97706',
          600: '#b45309',
        },
        navy: {
          800: '#0f172a',
          900: '#090d16',
          950: '#04070e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
