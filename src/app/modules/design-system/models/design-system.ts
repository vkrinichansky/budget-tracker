export enum MainPalette {
  White = '#ffffff',
  Grey = '#636766',
  DirtyWhite = '#F0F2F2',

  Charcoal = '#2C4251',
  Blue = '#395B72',
  LightBlue = '#E2F5FD',

  LightGreen = '#E4FCF7',
  Green = '#24B563',
  DarkGreen = '#109279',
  HoverGreen = '#0B7863',

  Red = '#FF6B69',
  LightRed = '#FFECEC',
}

export const ChartPalette = [
  '#AD3546',
  '#9B7B66',
  '#6087A8',
  '#803F4D',
  '#CD5D7D',
  '#CDCA97',
  '#6B9482',
  '#F3D8C4',
  '#F5F7F2',
  '#FEA8A9',
  '#B9DDA1',
  '#D1D1C7',
  '#FF716F',
  '#FF966E',
  '#FFCA6C',
  '#48698C',
  '#4C8285',
  '#BBDFCB',
  '#478381',
  '#8DC6CF',
  '#BFE2E6',
  '#FA9277',
  '#F6CB7C',
  '#FFD4B3',
  '#4D6F6E',
  '#49564C',
  '#73855F',
  '#F0ADA2',
  '#FED9C6',
  '#FCEBDB',
];

export type ColorScheme =
  | 'charcoal'
  | 'green'
  | 'transparent-light'
  | 'transparent-dark'
  | 'active-navigation-item';

export type BgColorScheme = 'white' | 'dark-green' | 'charcoal' | 'green' | 'red';

export type IconSize = 'small' | 'medium' | 'big' | 'large' | 'auto' | 'full-width';

export type ButtonSize = 'tiny' | 'small' | 'medium' | 'px100' | 'big' | 'large' | 'full' | 'auto';

export type InfoIconType = 'info' | 'warning';
