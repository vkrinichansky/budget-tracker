import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { IconSize } from '../../models';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'svg-icon',
  templateUrl: './svg-icon.component.html',
  styleUrls: ['./svg-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SvgIconComponent {
  @HostBinding('class')
  private get classes(): string {
    return `icon-${this.iconSize} ${this.resolveBgSize}`;
  }

  @Input()
  iconName: string;

  @Input()
  iconSize: IconSize = 'medium';

  @HostBinding('class.rounded-full')
  @Input()
  bgSize: 'small' | 'big';

  get resolveBgSize(): string {
    return this.bgSize ? `bg-${this.bgSize}` : '';
  }
}
