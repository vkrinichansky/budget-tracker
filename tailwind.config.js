function convertPixelsIntoRems(sizeInPx) {
  const spacingUnitInRems = 0.25;
  const spacingUnitInPx = 4;

  const scale = sizeInPx / spacingUnitInPx;
  const rems = scale * spacingUnitInRems;
  return { [scale.toString()]: `${rems}rem` };
}

const colors = {
  transparent: 'rgb(0, 0, 0, 0)',
  'current-color': 'currentColor',

  white: '#ffffff',
  'dirty-white': '#F0F2F2',
  grey: '#636766',
  'light-blue': '#E2F5FD',
  blue: '#395B72',
  charcoal: '#2C4251',
  green: '#24B563',
  'dark-green': '#109279',
  'dark-red': '#AD3546',
  yellow: '#E9AD03',
};

module.exports = {
  content: ['./src/**/*.{html,ts,scss,json}'],
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

    extend: {
      spacing: {
        inherit: 'inherit',
        ...convertPixelsIntoRems(52), // 52px,
        ...convertPixelsIntoRems(60), // 60px,
        ...convertPixelsIntoRems(66), // 66px,
        ...convertPixelsIntoRems(68), // 68px,
        ...convertPixelsIntoRems(72), // 72px,
        ...convertPixelsIntoRems(76), // 76px,
        ...convertPixelsIntoRems(100), // 100px,
        ...convertPixelsIntoRems(200), // 200px,
      },
      maxWidth: {
        ...convertPixelsIntoRems(200), // 200px,
        ...convertPixelsIntoRems(256), // 256px,
        '1/2': '50%',
      },
      minHeight: {
        ...convertPixelsIntoRems(36), // 36px,
        ...convertPixelsIntoRems(32), // 32px,
      },
      maxHeight: {
        ...convertPixelsIntoRems(200), // 200px,
      },
      colors: {
        inherit: 'inherit',
      },
    },
  },
};
