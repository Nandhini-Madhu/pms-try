/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#112031',
        mist: '#f4f8fb',
        coral: '#ff6b4a',
        sea: '#0f9d8f',
        sun: '#f4b400',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 12px 28px rgba(17, 32, 49, 0.12)',
      },
    },
  },
  plugins: [],
}

