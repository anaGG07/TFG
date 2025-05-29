/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        neomorphic:
          "15px 15px 30px rgba(120, 113, 108, 0.12), -15px -15px 30px rgba(255, 255, 255, 0.7)",
        "neomorphic-hover":
          "20px 20px 40px rgba(120, 113, 108, 0.15), -20px -20px 40px rgba(255, 255, 255, 0.8)",
        "neomorphic-inset":
          "inset 4px 4px 8px rgba(120, 113, 108, 0.1), inset -4px -4px 8px rgba(255, 255, 255, 0.8)",
        "neomorphic-small":
          "8px 8px 16px rgba(120, 113, 108, 0.12), -8px -8px 16px rgba(255, 255, 255, 0.7)",
        "neomorphic-tiny":
          "3px 3px 6px rgba(120, 113, 108, 0.1), -3px -3px 6px rgba(255, 255, 255, 0.7)",
      },
      backgroundImage: {
        backgroundImage: {
          neomorphic: "linear-gradient(145deg, #f4f1ed, #d5cdc0)",
          "neomorphic-light": "linear-gradient(145deg, #e7e0d5, #d5cdc0)", 
          "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        },
      },
      colors: {
        primary: {
          DEFAULT: "#d30006",
          light: "#ff393f",
          dark: "#650e00",
        },
        secondary: {
          DEFAULT: "#e7e0d5",
          light: "#f4f1ed",
          dark: "#d5cdc0",
        },
        eyraRed: "#d30006",
        eyraLightRed: "#ff393f",
        eyraLightPink: "#e7e0d5",
        eyraDeepRed: "#aa322b",
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
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
          "100%": {
            transform: "rotate(360deg) translateX(80px) rotate(-360deg)",
          },
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
