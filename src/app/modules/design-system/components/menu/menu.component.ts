import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { ButtonSize, ColorScheme, MenuAction } from '../../models';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  @HostBinding('class.use-current-color')
  @Input()
  shouldUseCurrentColor: boolean;

  @Input()
  colorScheme: ColorScheme = 'transparent-dark';

  @Input()
  buttonSizeX: ButtonSize = 'small';

  @Input()
  buttonSizeY: ButtonSize = 'small';

  @Input()
  icon = 'menu';

  @Input()
  menuActions: MenuAction[];

  @Input()
  text: string;

  @Input()
  menuDisabled: boolean;

  @Input()
  loading: boolean;

  get resolveColorScheme(): ColorScheme {
    return this.shouldUseCurrentColor ? null : this.colorScheme;
  }
}
