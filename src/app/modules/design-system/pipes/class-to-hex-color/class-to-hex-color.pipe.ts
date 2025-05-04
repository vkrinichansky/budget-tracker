import { Pipe, PipeTransform } from '@angular/core';

const COLORS: Record<string, string> = {
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

  'light-red': '#FFECEC',
  red: '#FF6B69',
  'dark-red': '#AD3546',

  yellow: '#E9AD03',
  'dark-yellow': '#C39104',

  'hover-white': 'rgb(255, 255, 255, 0.1)',
  'hover-black': 'rgb(0, 0, 0, 0.1)',
  'black-transparent': 'rgb(0, 0, 0, 0.5)',
};

const HEX_COLOR_PATTERN = /^#([0-9a-fA-F]{6})\b/;

@Pipe({
  name: 'classToHexColor',
  standalone: false,
})
export class ClassToHexColorPipe implements PipeTransform {
  transform(className: string): string {
    if (className.includes('bg-')) {
      return COLORS[className.replace('bg-', '')];
    }

    if (className.includes('text-')) {
      return COLORS[className.replace('text-', '')];
    }

    if (HEX_COLOR_PATTERN.test(className)) {
      return className;
    }

    return null;
  }
}
