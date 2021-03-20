const colors = require("tailwindcss/colors");
module.exports = {
  purge: ["./src/**/*.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      body: "DM Sans",
      display: "Raleway",
    },
    extend: {
      colors: {
        primary: "#F3F3F3",
        Gray: "#606060",
      },
    },
  },
  variants: {
    extend: {
      scale: ["group-hover"],
    },
  },
  plugins: [],
};
