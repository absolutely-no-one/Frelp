module.exports = {
  content: ["index.html",
    "home.html",
    "login.html",
    "playset.html",
    "signup.html",
    "loadsets.js",
    "./**/*.{html,js}",
    "./activities/**/*.{html,js}",
    "./create/**/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        "french-red": "#ED2939",
        "french-blue": "#002654",
        "amber": "#FFBE0B",
        "dark-amber": "#BF8E08"
      },
      boxShadow: {
        "2-amber": "0px 0px 0px 2px #FFBE0B"
      }
    },
    screens: {
      "xsm": "375px",
      'sm': '640px',
      'md': '768px',
      'mdlg': "896px",
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px'
    }
  },
  plugins: [],
}
