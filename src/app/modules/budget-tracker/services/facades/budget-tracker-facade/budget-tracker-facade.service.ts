import { Injectable } from '@angular/core';
import { AuthFacadeService } from '@budget-tracker/auth';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BudgetTrackerActions, BudgetTrackerSelectors } from '@budget-tracker/budget-tracker';

@Injectable()
export class BudgetTrackerFacadeService {
  constructor(private store: Store, private authFacade: AuthFacadeService) {}

  initData(): void {
    this.authFacade.initAuthState();
    this.store.dispatch(BudgetTrackerActions.init());
  }

  isDataLoading(): Observable<boolean> {
    return this.store.select(BudgetTrackerSelectors.dataLoadingSelector);
  }
}
