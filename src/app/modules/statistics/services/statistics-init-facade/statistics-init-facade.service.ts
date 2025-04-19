import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { StatisticsActions, StatisticsSelectors } from '../../store';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable()
export class StatisticsInitFacadeService {
  constructor(private store: Store) {}

  async initData(): Promise<void> {
    const isLoaded$ = this.store.select(StatisticsSelectors.statisticsLoadedSelector);

    if (!(await firstValueFrom(isLoaded$))) {
      this.store.dispatch(StatisticsActions.init());
    }
  }

  isDataLoaded(): Observable<boolean> {
    return this.store.select(StatisticsSelectors.statisticsLoadedSelector);
  }
}
