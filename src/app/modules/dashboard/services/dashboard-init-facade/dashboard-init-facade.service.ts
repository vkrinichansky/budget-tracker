import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CategoriesSelectors, DashboardInitActions } from '../../store';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable()
export class DashboardInitFacadeService {
  constructor(private store: Store) {}

  async initData(): Promise<void> {
    const isLoaded$ = this.store.select(CategoriesSelectors.categoriesLoadedSelector);

    if (!(await firstValueFrom(isLoaded$))) {
      this.store.dispatch(DashboardInitActions.loadDashboardData());
    }
  }

  isDataLoaded(): Observable<boolean> {
    return this.store.select(CategoriesSelectors.categoriesLoadedSelector);
  }
}
