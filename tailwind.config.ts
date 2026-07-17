import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#fdf8f0",
          100: "#faefd9",
          200: "#f4dbb3",
          300: "#ecc07f",
          400: "#e3a04a",
          500: "#d9862a",
          600: "#c06b1f",
          700: "#9f521c",
          800: "#80421d",
          900: "#69371b",
        },
      },
    },
  },
  plugins: [],
};

export default config;
