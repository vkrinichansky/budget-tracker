import { Component, OnInit } from '@angular/core';
import { BudgetTrackerFacadeService } from '@budget-tracker/budget-tracker';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-free-money-info-card',
  templateUrl: './free-money-info-card.component.html',
})
export class FreeMoneyInfoCardComponent implements OnInit {
  private readonly rootTranslationKey = 'dashboard.infoCards.freeMoney';

  freeMoney$: Observable<number>;

  constructor(private budgetTrackerFacade: BudgetTrackerFacadeService) {}

  ngOnInit(): void {
    this.freeMoney$ = this.budgetTrackerFacade.getFreeMoneyValue();
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }
}
