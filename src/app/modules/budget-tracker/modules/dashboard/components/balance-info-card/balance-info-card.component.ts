import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BudgetTrackerFacadeService } from '@budget-tracker/budget-tracker';
@Component({
  selector: 'app-balance-info-card',
  templateUrl: './balance-info-card.component.html',
})
export class BalanceInfoCardComponent implements OnInit {
  private readonly rootTranslationKey = 'dashboard.infoCards.balance';

  fullBalance$: Observable<number>;

  currentBalance$: Observable<number>;

  constructor(private budgetTrackerFacade: BudgetTrackerFacadeService) {}

  ngOnInit(): void {
    this.fullBalance$ = this.budgetTrackerFacade.getFullBalanceValue();
    this.currentBalance$ = this.budgetTrackerFacade.getCurrentBalanceValue();
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }
}
