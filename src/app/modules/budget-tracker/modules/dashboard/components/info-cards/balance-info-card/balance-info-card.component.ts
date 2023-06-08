import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BudgetTrackerFacadeService } from '@budget-tracker/budget-tracker';
import { MenuAction } from '@budget-tracker/design-system';
import { TranslateService } from '@ngx-translate/core';
import { InfoCardValueModalService } from '../../../services';
@Component({
  selector: 'app-balance-info-card',
  templateUrl: './balance-info-card.component.html',
})
export class BalanceInfoCardComponent implements OnInit {
  private readonly rootTranslationKey = 'dashboard.infoCards.balance';

  fullBalance$: Observable<number>;

  currentBalance$: Observable<number>;

  menuActions$: Observable<MenuAction[]>;

  constructor(
    private budgetTrackerFacade: BudgetTrackerFacadeService,
    private translateService: TranslateService,
    private infoCardValueModalService: InfoCardValueModalService
  ) {}

  ngOnInit(): void {
    this.fullBalance$ = this.budgetTrackerFacade.getFullBalanceValue();
    this.currentBalance$ = this.budgetTrackerFacade.getCurrentBalanceValue();

    this.menuActions$ = this.fullBalance$.pipe(map((fullBalance) => this.resolveMenuActions(fullBalance)));
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }

  private resolveMenuActions(fullBalance: number): MenuAction[] {
    return [
      {
        icon: 'plus',
        text: this.translateService.instant(this.buildTranslationKey('menu.increase')),
        action: () => this.infoCardValueModalService.openIncreaseBalanceModal(fullBalance),
      },
      {
        icon: 'minus',
        text: this.translateService.instant(this.buildTranslationKey('menu.decrease')),
        disabled: fullBalance === 0,
        action: () => this.infoCardValueModalService.openDecreaseBalanceModal(fullBalance),
      },
      {
        icon: 'edit',
        text: this.translateService.instant(this.buildTranslationKey('menu.edit')),
        action: () => this.infoCardValueModalService.openEditBalanceModal(fullBalance),
      },
    ];
  }
}
