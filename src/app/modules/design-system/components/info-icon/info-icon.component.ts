import { ChangeDetectionStrategy, Component, Input, TemplateRef } from '@angular/core';
import { IconSize, TooltipPosition } from '../../models';

@Component({
  selector: 'app-info-icon',
  templateUrl: './info-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoIconComponent {
  @Input()
  tooltip: TemplateRef<unknown> | string;

  @Input()
  size: IconSize = 'small';

  @Input()
  tooltipPosition: TooltipPosition = 'top';

  get isTemplate(): boolean {
    return this.tooltip instanceof TemplateRef;
  }

  get stringTooltip(): string {
    return typeof this.tooltip === 'string' ? this.tooltip : undefined;
  }

  get templateTooltip(): TemplateRef<unknown> {
    return this.tooltip instanceof TemplateRef ? this.tooltip : undefined;
  }
}
