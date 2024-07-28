import { Component, HostBinding } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'control-error',
  templateUrl: './control-error.component.html',
})
export class ControlErrorComponent {
  @HostBinding('class')
  private readonly classes = 'text-white font-main text-xs';
}
