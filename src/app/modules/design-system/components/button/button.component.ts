import { HostBinding } from '@angular/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @HostBinding('class.loading')
  @Input()
  loading: boolean;

  @HostBinding('class.disabled')
  @Input()
  disabled: boolean;

  @HostBinding('class')
  private get classes(): string {
    return `block rounded overflow-hidden ${this.buttonSize}`;
  }

  @Input()
  buttonSize: 'w-8' | 'w-60' = 'w-60';

  @Input()
  text = '';

  @Input()
  iconName: string;

  @Input()
  iconColor: string;
}
