import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { ColorScheme, InfoCardColorScheme, MenuAction } from '../../models';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoCardComponent {
  @HostBinding('class')
  @Input()
  colorScheme: InfoCardColorScheme = InfoCardColorScheme.White;

  @Input()
  primaryText: string;

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

  get menuColorScheme(): string {
    switch (this.colorScheme) {
      case InfoCardColorScheme.Charcoal:
      case InfoCardColorScheme.Green:
        return ColorScheme.TransparentLight;

      case InfoCardColorScheme.White:
        return ColorScheme.TransparentDark;
    }
  }
}
