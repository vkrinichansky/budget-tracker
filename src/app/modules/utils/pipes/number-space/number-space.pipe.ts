import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'numberSpace',
    standalone: false
})
export class NumberSpacePipe implements PipeTransform {
  transform(value: number | string): string {
    if (value == null) {
      return '';
    }

    // Convert value to string if it is a number
    const numString = value.toString();

    // Use regex to format the number with spaces
    return numString.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
}
