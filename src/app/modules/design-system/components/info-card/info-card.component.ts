import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { ColorScheme, BgColorScheme, MenuAction } from '../../models';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoCardComponent {
  @HostBinding('class')
  @Input()
  colorScheme: BgColorScheme = 'white';

  @Input()
  primaryText: string | number;

  @Input()
  secondaryText: string;

  @Input()
  additionalPrimaryText: string;

  @Input()
  additionalSecondaryText: string;

  @Input()
  twoLine = false;

  @Input()
  iconName: string;

  @Input()
  iconBGClass = 'bg-white';

  @Input()
  iconColorClass = 'text-charcoal';

  @Input()
  shouldDisplayMenu = false;

  @Input()
  menuActions: MenuAction[];

  get menuColorScheme(): ColorScheme {
    switch (this.colorScheme) {
      case 'charcoal':
      case 'green':
        return 'transparent-light';

      case 'white':
        return 'transparent-dark';
    }
  }
}
