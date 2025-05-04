import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AccountsSelectors,
  ActivityLogSelectors,
  CategoriesSelectors,
  DashboardInitActions,
} from '../../store';
import { combineLatest, firstValueFrom, map, Observable } from 'rxjs';

@Injectable()
export class DashboardInitFacadeService {
  constructor(private store: Store) {}

  async initData(): Promise<void> {
    const isLoaded$ = combineLatest([
      this.store.select(AccountsSelectors.accountsLoadedSelector),
      this.store.select(CategoriesSelectors.categoriesLoadedSelector),
      this.store.select(ActivityLogSelectors.activityLogLoadedSelector),
    ]).pipe(map(([a, b, c]) => a && b && c));

    if (!(await firstValueFrom(isLoaded$))) {
      this.store.dispatch(DashboardInitActions.loadDashboardData());
    }
  }

  isDataLoaded(): Observable<boolean> {
    return combineLatest([
      this.store.select(AccountsSelectors.accountsLoadedSelector),
      this.store.select(CategoriesSelectors.categoriesLoadedSelector),
      this.store.select(ActivityLogSelectors.activityLogLoadedSelector),
    ]).pipe(map(([a, b, c]) => a && b && c));
  }
}
