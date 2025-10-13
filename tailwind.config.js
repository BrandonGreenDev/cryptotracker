/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3A0519",
          dark: "#3A0519",
        },
        secondary: {
          DEFAULT: "#670D2F",
          light: "#3D86BA",
        },
        tertiary: {
          DEFAULT: "#A53860",
          light: "#3D86BA",
        },
        accent: {
          DEFAULT: "#ffffff",
          dark: "#c0ab9d",
        },
      },
    },
  },
  plugins: [],
};
