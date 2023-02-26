import { Injectable } from '@angular/core';
import { AuthFacadeService } from '@budget-tracker/auth';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BudgetTrackerActions, BudgetTrackerSelectors } from '../../../store';

@Injectable()
export class BudgetTrackerFacadeService {
  constructor(private store: Store, private authFacade: AuthFacadeService) {}

  initData(): void {
    this.authFacade.initAuthState();
    this.store.dispatch(BudgetTrackerActions.init());
  }

  getIncomeValue(): Observable<number> {
    return this.store.select(BudgetTrackerSelectors.incomeValueSelector);
  }

  getExpenseValue(): Observable<number> {
    return this.store.select(BudgetTrackerSelectors.expenseValueSelector);
  }

  getBalanceValue(): Observable<number> {
    return this.store.select(BudgetTrackerSelectors.balanceSelector);
  }

  getSavingsValue(): Observable<number> {
    return this.store.select(BudgetTrackerSelectors.savingsSelector);
  }

  getFreeMoneyValue(): Observable<number> {
    return this.store.select(BudgetTrackerSelectors.freeMoneySelector);
  }
}
