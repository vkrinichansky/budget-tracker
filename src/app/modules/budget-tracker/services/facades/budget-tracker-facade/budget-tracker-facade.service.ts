import { Injectable } from '@angular/core';
import { AuthFacadeService } from '@budget-tracker/auth';
import { Store } from '@ngrx/store';
import { BudgetTrackerActions } from '../../../store';

@Injectable()
export class BudgetTrackerFacadeService {
  constructor(private store: Store, private authFacade: AuthFacadeService) {}

  initData(): void {
    this.authFacade.initAuthState();
    this.store.dispatch(BudgetTrackerActions.init());
  }
}
