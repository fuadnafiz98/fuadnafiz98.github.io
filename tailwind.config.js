const colors = require("tailwindcss/colors");
module.exports = {
  corePlugins: {
    float: false,
  },
  purge: {
    content: ["./src/**/*.html"],
    options: {
      keyframes: true,
      fontFace: true,
    },
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      body: "DM Sans",
      display: "Raleway",
    },
    extend: {
      colors: {
        primary: "#F3F3F3",
        secondary: "D97706",
        Gray: "#606060",
      },
    },
  },
  variants: {
    extend: {
      scale: ["group-hover"],
      padding: ["hover"],
    },
  },
  plugins: [],
};
