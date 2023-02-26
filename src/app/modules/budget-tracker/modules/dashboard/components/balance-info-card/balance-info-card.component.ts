import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BudgetTrackerFacadeService } from '@budget-tracker/budget-tracker';
@Component({
  selector: 'app-balance-info-card',
  templateUrl: './balance-info-card.component.html',
})
export class BalanceInfoCardComponent implements OnInit {
  private readonly rootTranslationKey = 'dashboard.infoCards.balance';

  balance$: Observable<number>;

  constructor(private budgetTrackerFacade: BudgetTrackerFacadeService) {}

  ngOnInit(): void {
    this.balance$ = this.budgetTrackerFacade.getBalanceValue();
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }
}
