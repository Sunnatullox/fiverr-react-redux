/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation:{
        shine:"shine 1s"
      },
      keyframes:{
        shien:{
          "100%":{left:"1255"}
        }
      }
    },
  },
  plugins: [],
}

