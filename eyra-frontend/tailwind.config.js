/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-DEFAULT": "#C62328",
        "primary-light": "#FF6C5C",
        "primary-dark": "#FFEDEA",
        "secondary-DEFAULT": "#FF6C5C",
        "secondary-light": "#f5dfc4",
        "secondary-dark": "#B5413A",
        eyraRed: "#C62328",
        eyraLightRed: "#FF6C5C",
        eyraLightPink: "#f5dfc4",
        eyraDeepRed: "#B5413A",
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      keyframes: {
        skewing: {
          "0%": { transform: "skewX(6deg)" },
          "10%": { transform: "skewX(-6deg)" },
          "20%": { transform: "skewX(4deg)" },
          "30%": { transform: "skewX(-4deg)" },
          "40%": { transform: "skewX(2deg)" },
          "50%": { transform: "skewX(-6deg)" },
          "55%": { transform: "skewX(6deg)" },
          "60%": { transform: "skewX(-5deg)" },
          "65%": { transform: "skewX(5deg)" },
          "70%": { transform: "skewX(-4deg)" },
          "75%": { transform: "skewX(4deg)" },
          "80%": { transform: "skewX(-3deg)" },
          "85%": { transform: "skewX(3deg)" },
          "90%": { transform: "skewX(-2deg)" },
          "95%": { transform: "skewX(2deg)" },
          "100%": { transform: "skewX(1deg)" },
        },
        moving: {
          "0%": { transform: "translate(-100px)" },
          "30%": { transform: "translate(-25px)" },
          "70%": { transform: "translate(25px)" },
          "100%": { transform: "translate(100px)" },
        },
        skewingChild: {
          "0%": { transform: "skewX(-10deg)" },
          "100%": { transform: "skewX(10deg)" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg) translateX(80px) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(80px) rotate(-360deg)" },
        },
      },
      animation: {
        skewing: "skewing 2s ease-in-out infinite",
        moving: "moving 2s cubic-bezier(.97,.01,.12,.99) infinite alternate",
        skewingChild: "skewingChild 0.2s ease-in-out infinite alternate",
        orbit: "orbit 1.2s linear infinite",
      },
    },
  },
  plugins: [],
};