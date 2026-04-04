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
        black: "#080808",
        white: "#F4F2EE",
        gold: "#C8A96E",
        "gold-light": "#E8D5A8",
        grey: "#5A5A5A",
        "grey-light": "#141414",
        "grey-dark": "#0E0E0E",
        border: "rgba(200,169,110,0.18)",
        "border-dim": "rgba(244,242,238,0.06)",
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
        "35": "8.75rem",
      },
      fontSize: {
        "display": ["clamp(2.5rem, 5vw, 4.5rem)", { lineHeight: "1.1", letterSpacing: "-0.025em", fontWeight: "300" }],
        "heading": ["clamp(1.75rem, 3vw, 2.75rem)", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "300" }],
        "subheading": ["1.5rem", { lineHeight: "1.3", fontWeight: "300" }],
        "body": ["0.9375rem", { lineHeight: "1.65", fontWeight: "300" }],
        "small": ["0.75rem", { lineHeight: "1.5", fontWeight: "400" }],
        "tag": ["0.625rem", { lineHeight: "1.5", fontWeight: "400", letterSpacing: "0.22em" }],
        "mono-sm": ["0.6875rem", { lineHeight: "1.5", fontWeight: "400", letterSpacing: "0.1em" }],
      },
      borderRadius: {
        none: "0",
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease forwards",
        "fade-in": "fadeIn 0.6s ease forwards",
        "slide-in": "slideIn 0.4s ease forwards",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        "count-up": "countUp 1.5s ease forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-12px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pulseGold: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        countUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
