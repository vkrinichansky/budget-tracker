/** @type {import('tailwindcss').Config} */
const colors = {
  transparent: 'rgb(0, 0, 0, 0)',
  charcoal: '#2C4251',
  green: '#24B563',
  white: '#ffffff',
};

module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    colors: colors,

    backgroundColor: (theme) => ({
      ...theme('colors'),
    }),

    textColors: (theme) => ({
      ...theme('colors'),
    }),

    borderColor: (theme) => ({
      ...theme('colors'),
    }),

    fill: (theme) => ({
      ...theme('colors'),
    }),

    stroke: (theme) => ({
      ...theme('colors'),
    }),

    fontFamily: {
      main: 'Lato',
    },
  },
};
