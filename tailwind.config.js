/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#121212',
        primary: '#00E0FF', // Cyberpunk Cyan
        secondary: '#FF003C', // Cyberpunk Red
        accent: '#7000FF', // Cyberpunk Purple
        text: '#E0E0E0',
        muted: '#A0A0A0',
        border: '#333333',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'cyber-gradient': 'linear-gradient(to right, #00E0FF, #7000FF)',
      },
    },
  },
  plugins: [],
}
