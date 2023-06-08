const colors = {
  transparent: 'rgb(0, 0, 0, 0)',

  white: '#ffffff',
  grey: '#636766',
  'dirty-white': '#F0F2F2',

  charcoal: '#2C4251',
  blue: '#395B72',
  'light-blue': '#E2F5FD',

  'light-green': '#E4FCF7',
  green: '#24B563',
  'dark-green': '#109279',
  'hover-green': '#0B7863',

  red: '#FF6B69',
  'light-red': '#FFECEC',

  'hover-white': 'rgb(255, 255, 255, 0.1)',
  'hover-black': 'rgb(0, 0, 0, 0.1)',
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
      main: 'Inter',
    },
  },
};
