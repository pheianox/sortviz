module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}",
  ],
  darkMode: "class",
  safelist: [
    "bg-primary",
    "bg-success",
    "bg-error",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
