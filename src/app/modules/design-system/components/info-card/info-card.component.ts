import { ChangeDetectionStrategy, Component, HostBinding, Input, TemplateRef } from '@angular/core';
import { ColorScheme, BgColorScheme, MenuAction } from '../../models';
import { isMobileWidth } from '@budget-tracker/utils';

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
  shouldDisableMenu = false;

  @Input()
  tooltip: TemplateRef<unknown> | string;

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

  get isMobile(): boolean {
    return isMobileWidth();
  }
}
