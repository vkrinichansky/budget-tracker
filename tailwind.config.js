const colors = {
  transparent: 'rgb(0, 0, 0, 0)',
  charcoal: '#2C4251',
  dark: '#333B3D',
  green: '#24B563',
  white: '#ffffff',
  blue: '#395B72',
  grey: '#636766',
  'dark-green': '#109279',
  'light-green': '#E4FCF7',
  'light-red': '#FFECEC',
  'light-blue': '#E2F5FD',
  'dirty-white': '#F0F2F2',
  'hover-white': 'rgb(255, 255, 255, 0.1)',
  'hover-black': 'rgb(0, 0, 0, 0.1)',
  'hover-green': '#1DA156',
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
