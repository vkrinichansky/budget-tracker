import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IconSize } from '../../models';

@Component({
  selector: 'app-info-icon',
  templateUrl: './info-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoIconComponent {
  @Input()
  text: string;

  @Input()
  size: IconSize = 'small';

  @Input()
  tooltipPosition = 'above';
}
