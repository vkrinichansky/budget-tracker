import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ColorScheme, MenuAction } from '../../models';

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
}
