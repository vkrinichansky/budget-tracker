import { HostBinding } from '@angular/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ButtonSize, ColorsSet } from '../../models';

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
  buttonSize: ButtonSize = ButtonSize.Small;

  @Input()
  text = '';

  @Input()
  iconName: string;

  @Input()
  iconColor: ColorsSet;
}
