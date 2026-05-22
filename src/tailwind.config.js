/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx,css}",
    ],
    theme: {
      extend: {
        colors: {
          primary: "#ecc151",
          "on-primary": "#3e2e00",
          background: "#001710",
          surface: "#001710",
          "surface-container": "#00251b",
          "surface-container-high": "#003124",
          "surface-container-highest": "#0e3c2f",
          "on-background": "#beedd9",
          "on-surface": "#beedd9",
          "on-surface-variant": "#c0c8c3",
          secondary: "#a3d0be",
          "secondary-container": "#234e40",
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }