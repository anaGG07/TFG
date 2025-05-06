/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta de colores de EYRA CLUB en formato plano
        'primary-DEFAULT': '#C62328',
        'primary-light': '#FF6C5C',
        'primary-dark': '#FFEDEA',
        'secondary-DEFAULT': '#FF6C5C',
        'secondary-light': '#FFD0C9',
        'secondary-dark': '#B5413A',
        eyraRed: '#C62328',
        eyraLightRed: '#FF6C5C',
        eyraLightPink: '#FFD0C9',
        eyraDeepRed: '#B5413A',
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
};