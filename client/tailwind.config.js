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
          50: '#f0f4f8',
          100: '#d9e6f2',
          200: '#b3cce5',
          300: '#8db3d8',
          400: '#6799cb',
          500: '#4180be',
          600: '#16284f',
          700: '#0c7c92',
          800: '#16284f',
          900: '#0c7c92',
        },
        brand: {
          dark: '#16284f',
          light: '#0c7c92',
          gradient: 'linear-gradient(100deg, rgb(22, 40, 79) 2%, rgb(12, 124, 146) 100%)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}