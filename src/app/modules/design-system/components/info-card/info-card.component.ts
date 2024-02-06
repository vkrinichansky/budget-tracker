import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core';
import { ColorScheme, InfoCardColorScheme, MenuAction } from '../../models';
import { CurrencyService } from '@budget-tracker/shared';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoCardComponent implements OnInit {
  @HostBinding('class')
  @Input()
  colorScheme: InfoCardColorScheme = 'white';

  @Input()
  primaryText: string | number;

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
  iconColorClass = 'text-charcoal';

  @Input()
  shouldDisplayMenu = false;

  @Input()
  menuActions: MenuAction[];

  get menuColorScheme(): ColorScheme {
    switch (this.colorScheme) {
      case 'charcoal':
      case 'green':
        return 'transparent-light';

      case 'white':
        return 'transparent-dark';
    }
  }

  currencySymbol$: Observable<string>;

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.currencySymbol$ = this.currencyService.getCurrencySymbolObs();
  }
}
