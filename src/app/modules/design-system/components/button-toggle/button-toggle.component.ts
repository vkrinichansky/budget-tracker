import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button-toggle',
  templateUrl: './button-toggle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonToggleComponent {
  @HostBinding('class')
  private readonly classes = 'flex h-7 border-2 border-solid border-charcoal rounded-md';
}
