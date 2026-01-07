/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lexend', 'sans-serif'],
      },
      colors: {
        background: '#FAF9F6', // Off-white/Cream
        primary: '#4F46E5', // Indigo-600
        secondary: '#10B981', // Emerald-500
        text: '#1F2937', // Gray-800
      }
    },
  },
  plugins: [],
}
