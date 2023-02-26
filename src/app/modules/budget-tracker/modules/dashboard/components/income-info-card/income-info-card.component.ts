import { Component, OnInit } from '@angular/core';
import { BudgetTrackerFacadeService } from '@budget-tracker/budget-tracker';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-income-info-card',
  templateUrl: './income-info-card.component.html',
})
export class IncomeInfoCardComponent implements OnInit {
  private readonly rootTranslationKey = 'dashboard.infoCards.income';

  income$: Observable<number>;

  constructor(private budgetTrackerFacade: BudgetTrackerFacadeService) {}

  ngOnInit(): void {
    this.income$ = this.budgetTrackerFacade.getIncomeValue();
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }
}
