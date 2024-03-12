/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'subjectivity': ['Subjectivity'],
        'subjectivity-bold': ['Subjectivity-Bold'],           
      },
    },
  },
  plugins: [],
}

