import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NavigationBarItem } from '../../models';

@Component({
  selector: 'app-navigation-bar-item',
  templateUrl: './navigation-bar-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationBarItemComponent {
  @Input()
  item: NavigationBarItem;
}
