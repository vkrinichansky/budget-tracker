import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button-toggle',
  templateUrl: './button-toggle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ButtonToggleComponent {
  @HostBinding('class')
  private readonly classes = 'flex h-8 border-2 border-solid border-charcoal rounded-md';
}
