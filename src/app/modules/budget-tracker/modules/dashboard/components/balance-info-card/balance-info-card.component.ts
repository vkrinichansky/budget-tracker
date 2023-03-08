import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BudgetTrackerFacadeService } from '@budget-tracker/budget-tracker';
import { MenuAction } from '@budget-tracker/design-system';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-balance-info-card',
  templateUrl: './balance-info-card.component.html',
})
export class BalanceInfoCardComponent implements OnInit {
  private readonly rootTranslationKey = 'dashboard.infoCards.balance';

  fullBalance$: Observable<number>;

  currentBalance$: Observable<number>;

  menuActions: MenuAction[];

  constructor(
    private budgetTrackerFacade: BudgetTrackerFacadeService,
    private translateService: TranslateService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fullBalance$ = this.budgetTrackerFacade.getFullBalanceValue();
    this.currentBalance$ = this.budgetTrackerFacade.getCurrentBalanceValue();
    
    this.resolveMenuActions();
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }

  private resolveMenuActions(): void {
    this.menuActions = [
      {
        text: this.translateService.instant(this.buildTranslationKey('menu.increase')),
      },
      {
        text: this.translateService.instant(this.buildTranslationKey('menu.decrease')),
      },
      {
        text: this.translateService.instant(this.buildTranslationKey('menu.edit')),
      },
    ];

    this.cd.detectChanges();
  }
}
