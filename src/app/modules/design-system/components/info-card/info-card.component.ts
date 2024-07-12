import { ChangeDetectionStrategy, Component, HostBinding, Input, TemplateRef } from '@angular/core';
import { ColorScheme, BgColorScheme, MenuAction } from '../../models';
import { isMobileWidth } from '@budget-tracker/utils';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoCardComponent {
  @HostBinding('class')
  private get classes(): string {
    return this.shouldUseCssStyles ? '' : this.colorScheme;
  }

  @HostBinding('style')
  private get myStyle(): SafeStyle {
    if (this.shouldUseCssStyles) {
      return this.sanitizer.bypassSecurityTrustStyle(
        `background-color: ${this.hexBgColor}; color: ${this.hexTextColor}`
      );
    }

    return '';
  }

  @Input()
  colorScheme: BgColorScheme = 'white';

  @Input()
  primaryText: string | number;

  @Input()
  secondaryText: string;

  @Input()
  tertiaryText: string;

  @Input()
  additionalPrimaryText: string;

  @Input()
  additionalSecondaryText: string;

  @Input()
  iconName: string;

  @Input()
  iconBgClass = 'bg-white';

  @Input()
  iconColorClass = 'text-charcoal';

  @Input()
  shouldDisableMenu: boolean;

  @Input()
  shouldUseCssStyles: boolean;

  @Input()
  hexBgColor = '';

  @Input()
  hexTextColor = '';

  @Input()
  tooltip: TemplateRef<unknown> | string;

  @Input()
  menuActions: MenuAction[];

  @Input()
  menuLoading: boolean;

  get iconClasses(): string {
    return this.shouldUseCssStyles ? '' : `${this.iconBgClass} ${this.iconColorClass}`;
  }

  get isMobile(): boolean {
    return isMobileWidth();
  }

  get menuColorScheme(): ColorScheme {
    switch (this.colorScheme) {
      case 'charcoal':
      case 'green':
      case 'dark-green':
      case 'red':
        return 'transparent-light';

      case 'white':
        return 'transparent-dark';
    }
  }

  constructor(private sanitizer: DomSanitizer) {}
}
