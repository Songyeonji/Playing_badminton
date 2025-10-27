import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: '#80A1BA',
        accent: '#91C4C3',
        surface: '#B4DEBD',
        bgCustom: '#FFF7DD',
      },
    },
  },
  plugins: [],
};
export default config;
