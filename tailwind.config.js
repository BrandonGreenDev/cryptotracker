/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1B3C53",
          dark: "#152e3f",
        },
        secondary: {
          DEFAULT: "#234C6A",
          light: "#3D86BA",
        },
        tertiary: {
          DEFAULT: "#456882",
          light: "#3D86BA",
        },
        accent: {
          DEFAULT: "#D2C1B6",
          dark: "#c0ab9d",
        },
      },
    },
  },
  plugins: [],
};
