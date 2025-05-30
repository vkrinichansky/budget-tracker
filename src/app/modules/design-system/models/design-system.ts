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

  DarkRed = '#AD3546',
  LightRed = '#FFECEC',
}

export const IconsForUser = [
  'home',
  'basket',
  'pill',
  'clothes',
  'entertainment',
  'bus',
  'car',
  'bath',
  'rest',
  'work',
  'cake',
  'lamp',
  'laptop',
  'internet',
  'tv',
  'flower',
  'heart',
  'card-dollar',
  'card-euro',
  'creditcard',
  'money-multiple',
  'safe',
  'wallet',
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
