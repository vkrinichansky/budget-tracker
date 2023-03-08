import { Component, HostBinding, Input } from '@angular/core';
import { ColorsSet, MenuAction } from '../../models';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss'],
})
export class InfoCardComponent {
  @HostBinding('class')
  @Input()
  bgMode: ColorsSet = ColorsSet.White;

  @Input()
  primaryText: string;

  @Input()
  secondaryText: string;

  @Input()
  additionalPrimaryText: string;

  @Input()
  additionalSecondaryText: string;

  @Input()
  twoLine = false;

  @Input()
  iconName: string;

  @Input()
  iconBGClass = 'bg-white';

  @Input()
  shouldDisplayMenu = false;

  @Input()
  menuActions: MenuAction[];
}
