/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B3CB4',
          50: '#E6EEFF',
          100: '#CCDCFF',
          200: '#99B9FF',
          300: '#6696FF',
          400: '#3373FF',
          500: '#0B3CB4',
          600: '#093091',
          700: '#07246E',
          800: '#05184B',
          900: '#030C28',
        },
        secondary: {
          DEFAULT: '#39A053',
          50: '#E8F5EB',
          100: '#D1EBD7',
          200: '#A3D7AF',
          300: '#75C387',
          400: '#47AF5F',
          500: '#39A053',
          600: '#2E8042',
          700: '#236032',
          800: '#184021',
          900: '#0C2011',
        },
      },
    },
  },
  plugins: [],
}
