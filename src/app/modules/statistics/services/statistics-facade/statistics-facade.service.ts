import { Injectable } from '@angular/core';
import { StatisticsSnapshot } from '@budget-tracker/shared-models';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { StatisticsSelectors } from '../../store';

@Injectable()
export class StatisticsFacadeService {
  constructor(private readonly store: Store) {}

  getSnapshots(): Observable<StatisticsSnapshot[]> {
    return this.store.select(StatisticsSelectors.statisticsSnapshotsSelector);
  }
}
