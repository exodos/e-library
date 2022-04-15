const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        "3xl": "0 1px 8px  rgba(0, 0, 0, 0.2)",
      },
      colors: {
        cyan: colors.cyan,
        lightGreen: "#8DC63F",
        deepGreen: "#00AB4E",
        lightBlue: "#188ECE",
        deepBlue: "#034EA2",
        eRed: "#ED1C24",
        eYellow: "#FFC20E",
        eWhite: "#FFFFFF",
        eGrey: "#d3d3d3",
        eBlack: "#000000",

        myGray100: "#6c19e1",
        myGray800: "#343036",
        success100: "#a2f0bc",
        success500: "#12bd4b",
        error500: "#a10c4a",
        myBlack: "#1b1b1b",
        myPending: "#177cbe",
        mySuccess: "#10be58",
        myError: "#e65035",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "3xl": "1600px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
