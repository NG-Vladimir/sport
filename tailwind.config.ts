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
        dark: {
          bg: "#0a0a0a",
          card: "#141414",
          border: "#1f1f1f",
          muted: "#262626",
        },
        neon: {
          lime: "#b8ff3c",
          green: "#00ff88",
          cyan: "#00d4ff",
          pink: "#ff006e",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 20px rgba(184, 255, 60, 0.3)" },
          "50%": { opacity: "0.9", boxShadow: "0 0 30px rgba(184, 255, 60, 0.5)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
