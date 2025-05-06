/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta de colores EYRA CLUB según kit de marca
        primary: {
          DEFAULT: '#C62328',
          light: '#FF6C5C',
          dark: '#FFEDEA',
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#C62328',  // Color base rojo
          600: '#9f1239',
          700: '#881337',
          800: '#701a29',
          900: '#581c23',
          950: '#450a0a',
        },
        secondary: {
          DEFAULT: '#FF6C5C',
          light: '#FFD0C9',
          dark: '#B5413A',
          50: '#fff1f2',
          100: '#FFD0C9',  // Color base rosa claro
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#FF6C5C',  // Color rosa-rojo
          500: '#ec4899',
          600: '#B5413A',  // Color burdeos
          700: '#BE185D',
          800: '#9d174d',
          900: '#831843',
          950: '#500724',
        },
        accent: {
          50: '#fff7f7',
          100: '#feebeb',
          200: '#fad2d2',
          300: '#f5a9a9',
          400: '#ef7a7a',
          500: '#e94a4a',
          600: '#dc2a2a',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
};