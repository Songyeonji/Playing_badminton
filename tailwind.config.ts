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
        // Additional colors for variety
        cream: '#F2EFE7',
        lightTeal: '#9ACBD0',
        teal: '#48A6A7',
        darkTeal: '#006A71',
      },
    },
  },
  plugins: [],
};
export default config;
