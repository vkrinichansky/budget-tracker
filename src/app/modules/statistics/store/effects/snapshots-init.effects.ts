import { Injectable } from '@angular/core';
import { AuthActions } from '@budget-tracker/auth';
import { Snapshots } from '@budget-tracker/models';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, from, map } from 'rxjs';
import { StatisticsActions } from '../actions';
import { StatisticsInitApiService } from '../../services';

@Injectable()
export class SnapshotsInitEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly snapshotsInitApiService: StatisticsInitApiService
  ) {}

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StatisticsActions.init),
      switchMap(() => from(this.snapshotsInitApiService.initData())),
      map((data: Snapshots) =>
        StatisticsActions.statisticsLoaded({ snapshots: Object.values(data.snapshots) })
      )
    )
  );

  cleanStateOnLogOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      map(() => StatisticsActions.clean())
    )
  );
}
