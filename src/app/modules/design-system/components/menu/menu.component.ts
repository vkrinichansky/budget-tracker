import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ButtonSize, ColorScheme, MenuAction } from '../../models';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
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
}
