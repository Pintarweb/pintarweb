/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./clients/*/index.html", "./landing/index.html"],
  theme: {
    extend: {
      fontFamily: {
        jakarta: ['"Plus Jakarta Sans"', "sans-serif"],
        manrope: ['"Manrope"', "sans-serif"],
        inter: ['"Inter"', "sans-serif"],
      },
      colors: {
        // trustworthy-local mood
        forest: { DEFAULT: "#1B4332", soft: "#2D5A46", light: "#52B788" },
        amber: { DEFAULT: "#F59E0B", soft: "#FCD34D" },
        // bold-urgent mood
        ink: { DEFAULT: "#111111", soft: "#2A2A2A" },
        signal: { DEFAULT: "#DC2626", soft: "#FCA5A5" },
        // premium-modern mood
        slate: { DEFAULT: "#111827", soft: "#374151" },
        bronze: { DEFAULT: "#C08457", soft: "#E5C29F" },
      },
    },
  },
  plugins: [],
};
