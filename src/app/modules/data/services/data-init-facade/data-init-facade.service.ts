import { Injectable } from '@angular/core';
import { AuthFacadeService } from '@budget-tracker/auth';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DataInitActions, DataInitSelectors } from '../../store';

@Injectable()
export class DataInitFacadeService {
  constructor(private store: Store, private authFacade: AuthFacadeService) {}

  initData(): void {
    this.authFacade.initAuthState();
    this.store.dispatch(DataInitActions.init());
  }

  isDataLoading(): Observable<boolean> {
    return this.store.select(DataInitSelectors.dataLoadingSelector);
  }
}
