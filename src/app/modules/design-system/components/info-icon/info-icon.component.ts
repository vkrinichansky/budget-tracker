import { ChangeDetectionStrategy, Component, Input, TemplateRef } from '@angular/core';
import { IconSize, InfoIconType, TooltipPosition } from '../../models';

@Component({
  selector: 'app-info-icon',
  templateUrl: './info-icon.component.html',
  styleUrl: './info-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoIconComponent {
  @Input()
  tooltip: TemplateRef<unknown> | string;

  @Input()
  size: IconSize = 'small';

  @Input()
  tooltipPosition: TooltipPosition = 'top';

  @Input()
  type: InfoIconType = 'info';

  get isTemplate(): boolean {
    return this.tooltip instanceof TemplateRef;
  }

  get stringTooltip(): string {
    return typeof this.tooltip === 'string' ? this.tooltip : undefined;
  }

  get templateTooltip(): TemplateRef<unknown> {
    return this.tooltip instanceof TemplateRef ? this.tooltip : undefined;
  }

  get colorClasses(): string {
    switch (this.type) {
      case 'info':
        return 'text-charcoal hover:text-blue';

      case 'warning':
        return 'text-yellow hover:text-dark-yellow';
    }
  }

  get icon(): string {
    switch (this.type) {
      case 'info':
        return 'info';

      case 'warning':
        return 'alert-triangle';
    }
  }
}
