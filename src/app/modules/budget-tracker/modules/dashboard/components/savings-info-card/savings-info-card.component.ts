import { Component, OnInit } from '@angular/core';
import { BudgetTrackerFacadeService } from '@budget-tracker/budget-tracker';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-savings-info-card',
  templateUrl: './savings-info-card.component.html',
})
export class SavingsInfoCardComponent implements OnInit {
  private readonly rootTranslationKey = 'dashboard.infoCards.savings';

  savings$: Observable<number>;

  constructor(private budgetTrackerFacade: BudgetTrackerFacadeService) {}

  ngOnInit(): void {
    this.savings$ = this.budgetTrackerFacade.getSavingsValue();
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }
}
