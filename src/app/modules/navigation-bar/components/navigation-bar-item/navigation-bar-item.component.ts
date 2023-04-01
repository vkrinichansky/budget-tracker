import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NavigationBarItem } from '../../models';
import { ColorScheme } from 'src/app/modules/design-system/models/colors-set.enum';

@Component({
  selector: 'app-navigation-bar-item',
  templateUrl: './navigation-bar-item.component.html',
  styleUrls: ['./navigation-bar-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationBarItemComponent {
  readonly colorScheme = ColorScheme;

  @Input()
  item: NavigationBarItem;
}
