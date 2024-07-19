import { Directive, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[preventInvalidChars]',
})
export class PreventInvalidCharsDirective {
  @Input('preventInvalidChars') invalidChars: string[] = [];

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    if (!!this.invalidChars.length && this.invalidChars.includes(event.key)) {
      event.preventDefault();
    }
  }
}
