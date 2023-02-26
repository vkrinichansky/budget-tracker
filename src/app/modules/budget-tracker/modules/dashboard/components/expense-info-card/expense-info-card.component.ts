import { Component, OnInit } from '@angular/core';
import { BudgetTrackerFacadeService } from '@budget-tracker/budget-tracker';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-expense-info-card',
  templateUrl: './expense-info-card.component.html',
})
export class ExpenseInfoCardComponent implements OnInit {
  private readonly rootTranslationKey = 'dashboard.infoCards.expense';

  expense$: Observable<number>;

  constructor(private budgetTrackerFacade: BudgetTrackerFacadeService) {}

  ngOnInit(): void {
    this.expense$ = this.budgetTrackerFacade.getExpenseValue();
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }
}
