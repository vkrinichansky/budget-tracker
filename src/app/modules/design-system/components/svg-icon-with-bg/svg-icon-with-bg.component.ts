import { ChangeDetectionStrategy, Input } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'svg-icon-with-bg',
  templateUrl: './svg-icon-with-bg.component.html',
  styleUrls: ['./svg-icon-with-bg.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgIconWithBgComponent {
  @Input()
  iconName: string;
}
