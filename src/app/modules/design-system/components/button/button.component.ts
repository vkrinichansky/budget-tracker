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

  @Input()
  text = '';

  @HostBinding('class')
  private classes = `rounded overflow-hidden ${this.text ? 'w-8' : 'w-auto'}`;

  @Input()
  iconName: string;

  @Input()
  iconColor: string;
}
