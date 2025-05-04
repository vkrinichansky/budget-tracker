import { Directive, Input, HostListener } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[preventInvalidChars]',
  standalone: false,
})
export class PreventInvalidCharsDirective {
  @Input('preventInvalidChars') invalidChars: string[] = [];

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    if (!!this.invalidChars.length && this.invalidChars.includes(event.key)) {
      event.preventDefault();
    }
  }
}
