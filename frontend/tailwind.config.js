/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0066CC',
        success: '#00B050',
        danger: '#FF0000',
        warning: '#FFA500',
      },
    },
  },
  plugins: [],
}
