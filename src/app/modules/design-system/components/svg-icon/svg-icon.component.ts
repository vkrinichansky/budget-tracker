import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

enum IconSize {
  Small = 'small',
  Medium = 'medium',
  Big = 'big',
  Auto = 'auto',
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'svg-icon',
  templateUrl: './svg-icon.component.html',
  styleUrls: ['./svg-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgIconComponent {
  @Input()
  iconName: string;

  @HostBinding('class')
  @Input()
  size: IconSize = IconSize.Medium;
}
