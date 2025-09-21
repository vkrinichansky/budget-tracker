import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberSpace',
  standalone: false,
})
export class NumberSpacePipe implements PipeTransform {
  transform(value: number | string, displaySign = false): string {
    if (value == null) {
      return '';
    }

    // Convert value to string if it is a number
    const numString = value.toString();
    const resultValue = numString.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    if (displaySign && typeof value === 'number' && !isNaN(value)) {
      if (value > 0) {
        return `+${resultValue}`;
      }

      if (value < 0 || value === 0) {
        return resultValue;
      }
    }

    // Use regex to format the number with spaces
    return resultValue;
  }
}
