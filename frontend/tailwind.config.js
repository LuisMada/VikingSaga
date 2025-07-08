/** @type {import('tailwindcss').Config} */
export default {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          'viking-gold': '#D4AF37',
          'viking-bronze': '#CD7F32',
          'viking-stone': '#8B7355',
          'viking-red': '#8B0000',
          'viking-blue': '#1e3a8a',
        },
        fontFamily: {
          'norse': ['serif'],
        },
      },
    },
    plugins: [],
  }