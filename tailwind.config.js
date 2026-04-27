/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0f172a',
          surface: '#1e293b',
          border: '#334155'
        },
        brand: {
          primary: '#38bdf8',
          success: '#4ade80',
          warning: '#facc15',
          danger: '#f87171'
        }
      }
    },
  },
  plugins: [],
}
