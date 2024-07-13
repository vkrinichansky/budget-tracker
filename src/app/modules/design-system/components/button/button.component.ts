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
  @HostBinding('class')
  private get classes(): string {
    return `flex rounded overflow-hidden
    ${this.align}
    ${this.buttonSizeClasses}
    ${this.activeStateClass}
    ${this.colorSchemeClass}`;
  }

  private get buttonSizeClasses(): string {
    return `${this.buttonSizeX}-x ${this.buttonSizeY}-y`;
  }

  private get activeStateClass(): string {
    return `${this.active ? 'active-' + this.activeColorScheme : ''}`;
  }

  private get colorSchemeClass(): string {
    return `${this.colorScheme ? this.colorScheme : ''}`;
  }

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

  @HostBinding('class.mobile-click-effect')
  @Input()
  shouldDisplayMobileClickEffect = true;

  @Input()
  activeColorScheme: ColorScheme = 'green';

  @Input()
  buttonSizeX: ButtonSize = 'medium';

  @Input()
  buttonSizeY: ButtonSize = 'medium';

  @Input()
  colorScheme: ColorScheme = 'transparent-dark';

  @Input()
  align: 'center' | 'start' = 'center';

  @Input()
  text = '';

  @Input()
  iconName: string;

  get loaderColorMode(): 'dark' | 'light' {
    switch (this.colorScheme) {
      case 'charcoal':
      case 'green':
        return 'light';

      case 'transparent-light':
      case 'transparent-dark':
      case 'active-navigation-item':
        return 'dark';
    }
  }
}
