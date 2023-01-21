import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input()
  bgClass: string = '';

  @Input()
  textColorClass: string = 'text-white';

  @Input()
  iconName: string;

  @Input()
  text: string;

  @Input()
  iconColorClass: string;

  @Input()
  loading: boolean;

  @Input()
  disabled: boolean;
}
