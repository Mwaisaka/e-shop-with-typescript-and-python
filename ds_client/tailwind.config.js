/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
     "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "flex",
    "grid",
    "hidden",
    "block",
    "w-64",
    "w-72",
    "md:grid-cols-2",
    "md:grid-cols-3",
    "lg:grid-cols-4",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}