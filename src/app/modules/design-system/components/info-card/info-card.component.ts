import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss'],
})
export class InfoCardComponent {
  @HostBinding('class')
  @Input()
  bgMode: 'light' | 'dark' | 'green' = 'light';

  @Input()
  primaryText: string;

  @Input()
  secondaryText: string;

  @Input()
  iconName: string;

  @Input()
  iconBGClass = 'bg-white';
}
