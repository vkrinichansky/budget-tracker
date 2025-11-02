import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'control-label',
  templateUrl: './control-label.component.html',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlLabelComponent {
  @Input()
  required: boolean;

  @Input()
  for: string;

  @Input()
  label: string;
}
