import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

type IconSize = '20px' | '24px' | '40px';
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
    return `${this.resolveIconSize} ${this.resolveBgSize}`;
  }

  @Input()
  iconName: string;

  @Input()
  iconSize: IconSize = '24px';

  @HostBinding('class.rounded-full')
  @Input()
  bgSize: 'small' | 'big';

  get resolveBgSize(): string {
    return this.bgSize ? `bg-${this.bgSize}` : '';
  }

  get resolveIconSize(): string {
    return this.iconSize ? `icon-${this.iconSize}` : '';
  }
}
