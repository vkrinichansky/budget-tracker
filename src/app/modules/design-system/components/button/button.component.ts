import { HostBinding } from '@angular/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ButtonSize, ColorScheme } from '../../models';


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

  // it means that button related option was selected and button becomes unclickable (not same as disabled, another color scheme)
  @HostBinding('class.active')
  @Input()
  active = false;

  @Input()
  activeColorScheme: ColorScheme = 'green';

  @HostBinding('class')
  private get classes(): string {
    return `flex rounded overflow-hidden ${this.buttonSizeX}-x ${this.buttonSizeY}-y ${this.colorScheme} ${
      this.active ? 'active-' + this.activeColorScheme : ''
    } ${this.align}`;
  }

  @Input()
  buttonSizeX: ButtonSize = 'small';

  @Input()
  buttonSizeY: ButtonSize = 'medium';

  @Input()
  text = '';

  @Input()
  iconName: string;

  @Input()
  colorScheme: ColorScheme = 'transparent-dark';

  @Input()
  align: 'center' | 'start' = 'center';
}
