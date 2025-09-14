import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, from, switchMap, of, catchError, map, tap, EMPTY, timeout } from 'rxjs';
import { ActivityLogActions } from './activity-log.actions';
import { ActivityLogApiService } from '../services';
import { AuthActions } from '@budget-tracker/auth';
import { ActivityLogEvents } from '../models';
import { EventBusService } from '@budget-tracker/utils';
import { Store } from '@ngrx/store';

const REQUEST_TIMEOUT = 5000;

@Injectable()
export class ActivityLogEffects {
  constructor(
    private actions$: Actions,
    private activityLogService: ActivityLogApiService,
    private eventBus: EventBusService,
    private store: Store
  ) {}

  loadActivityLog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActivityLogActions.loadActivityLog),
      switchMap(() =>
        from(this.activityLogService.loadActivityLog()).pipe(
          timeout(REQUEST_TIMEOUT),
          map((activityLog) =>
            ActivityLogActions.activityLogLoaded({ activityLog: Object.values(activityLog) })
          )
        )
      )
    )
  );

  bulkRecordsRemove$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ActivityLogActions.bulkRecordsRemove),
        mergeMap(() =>
          from(this.activityLogService.bulkRecordRemove()).pipe(
            timeout(REQUEST_TIMEOUT),
            tap(() => {
              this.store.dispatch(ActivityLogActions.bulkRecordsRemoved());

              this.eventBus.emit({
                type: ActivityLogEvents.REMOVE_ALL_RECORDS,
                status: 'success',
              });
            }),
            catchError(() => {
              this.eventBus.emit({
                type: ActivityLogEvents.REMOVE_ALL_RECORDS,
                status: 'error',
                errorCode: 'errors.activityLog.removeAllRecordsFailed',
              });

              return EMPTY;
            })
          )
        )
      ),
    { dispatch: false }
  );

  cleanStateOnLogOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() => of(ActivityLogActions.cleanState()))
    )
  );
}
