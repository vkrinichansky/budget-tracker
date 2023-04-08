import { Component, OnInit } from '@angular/core';
import { BudgetTrackerFacadeService } from '@budget-tracker/budget-tracker';
import { InfoCardColorScheme, MenuAction } from '@budget-tracker/design-system';
import { TranslateService } from '@ngx-translate/core';
import { map, Observable } from 'rxjs';
import { InfoCardValueModalService } from '../../../services';

@Component({
  selector: 'app-free-money-info-card',
  templateUrl: './free-money-info-card.component.html',
})
export class FreeMoneyInfoCardComponent implements OnInit {
  private readonly rootTranslationKey = 'dashboard.infoCards.freeMoney';

  readonly colorScheme = InfoCardColorScheme;

  freeMoney$: Observable<number>;

  menuActions$: Observable<MenuAction[]>;

  constructor(
    private budgetTrackerFacade: BudgetTrackerFacadeService,
    private translateService: TranslateService,
    private infoCardValueModalService: InfoCardValueModalService
  ) {}

  ngOnInit(): void {
    this.freeMoney$ = this.budgetTrackerFacade.getFreeMoneyValue();

    this.menuActions$ = this.freeMoney$.pipe(map((freeMoney) => this.resolveMenuActions(freeMoney)));
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }

  private resolveMenuActions(freeMoney: number): MenuAction[] {
    return [
      {
        icon: 'plus',
        text: this.translateService.instant(this.buildTranslationKey('menu.increase')),
        action: () => this.infoCardValueModalService.openIncreaseFreeMoneyModal(freeMoney),
      },
      {
        icon: 'minus',
        text: this.translateService.instant(this.buildTranslationKey('menu.decrease')),
        disabled: freeMoney === 0,
        action: () => this.infoCardValueModalService.openDecreaseFreeMoneyModal(freeMoney),
      },
      {
        icon: 'edit',
        text: this.translateService.instant(this.buildTranslationKey('menu.edit')),
        action: () => this.infoCardValueModalService.openEditFreeMoneyModal(freeMoney),
      },
    ];
  }
}