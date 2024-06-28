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
  menuActions: MenuAction[];

  @Input()
  icon = 'menu';

  @Input()
  text: string;

  @Input()
  buttonSizeX: ButtonSize = 'small';

  @Input()
  buttonSizeY: ButtonSize = 'small';

  @Input()
  menuDisabled: boolean;

  @Input()
  loading: boolean;
}
