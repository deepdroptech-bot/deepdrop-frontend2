/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
  animation: {
    spinSlow: "spin 4s linear infinite",
    bounceSoft: "bounceSoft 1.8s ease-in-out infinite",
    gradientMove: "gradientMove 6s ease infinite",
    glow: "glow 1.5s ease-in-out infinite alternate",
  },
  keyframes: {
    bounceSoft: {
      "0%, 100%": { transform: "translateY(0)" },
      "50%": { transform: "translateY(-18px)" },
    },
    gradientMove: {
      "0%": { backgroundPosition: "0% 50%" },
      "50%": { backgroundPosition: "100% 50%" },
      "100%": { backgroundPosition: "0% 50%" },
    },
    glow: {
      "0%": { filter: "drop-shadow(0 0 5px rgba(255,255,255,.4))" },
      "100%": { filter: "drop-shadow(0 0 25px rgba(255,255,255,.9))" },
    },
    successPop: {
      "0%": {
        transform: "scale(0.8)",
        opacity: 0,
      },
      "100%": {
        transform: "scale(1)",
        opacity: 1,
      },
    },
    checkBounce: {
      "0%": {
        transform: "scale(0)",
      },
      "70%": {
        transform: "scale(1.2)",
      },
      "100%": {
        transform: "scale(1)",
      },
    },
  },
    },
  },
  plugins: [], 
};
