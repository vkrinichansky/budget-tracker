import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ColorScheme, MenuAction } from '../../models';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  @Input()
  colorScheme: ColorScheme = ColorScheme.TransparentDark;

  @Input()
  menuActions: MenuAction[];
}
