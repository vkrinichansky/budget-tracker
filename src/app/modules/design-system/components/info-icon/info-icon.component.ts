import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-info-icon',
  templateUrl: './info-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoIconComponent {
  @Input()
  text: string;

  @Input()
  size = 'small';

  @Input()
  tooltipPosition = 'above';
}
