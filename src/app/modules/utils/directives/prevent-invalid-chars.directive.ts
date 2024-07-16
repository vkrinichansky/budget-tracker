import { Directive, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[appPreventInvalidChars]',
})
export class PreventInvalidCharsDirective {
  @Input('appPreventInvalidChars') invalidChars: string[] = [];

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    if (!!this.invalidChars.length && this.invalidChars.includes(event.key)) {
      event.preventDefault();
    }
  }
}
