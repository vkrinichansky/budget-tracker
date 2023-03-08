import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ColorsSet } from '../../models';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  readonly colorsSet = ColorsSet;

  get resolveMenuColor(): string {
    switch (this.colorMode) {
      case ColorsSet.Charcoal:
        return ColorsSet.White;
        break;

      case ColorsSet.White:
        return ColorsSet.Charcoal;
        break;

      case ColorsSet.Green:
        return ColorsSet.White;
        break;
    }
  }

  @Input()
  colorMode: ColorsSet = ColorsSet.Charcoal;
}
