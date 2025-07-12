import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, from, switchMap, of, catchError, map, tap, EMPTY } from 'rxjs';
import { ActivityLogActions } from './activity-log.actions';
import { ActivityLogApiService } from '../services';
import { AuthActions } from '@budget-tracker/auth';
import { ActivityLogEvents } from '../models';
import { EventBusService } from '@budget-tracker/utils';

@Injectable()
export class ActivityLogEffects {
  constructor(
    private actions$: Actions,
    private activityLogService: ActivityLogApiService,
    private eventBus: EventBusService
  ) {}

  initActivityLogDB$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ActivityLogActions.initActivityLogDB),
        switchMap(() =>
          from(this.activityLogService.initActivityLogDB()).pipe(
            tap(() =>
              this.eventBus.emit({
                type: ActivityLogEvents.INIT_ACTIVITY_LOG_DB,
                status: 'success',
              })
            ),
            catchError(() => {
              this.eventBus.emit({
                type: ActivityLogEvents.INIT_ACTIVITY_LOG_DB,
                status: 'error',
                errorCode: 'errors.activityLog.initActivityLogDBFailed',
              });

              return EMPTY;
            })
          )
        )
      ),
    { dispatch: false }
  );

  loadActivityLog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActivityLogActions.loadActivityLog),
      switchMap(() => from(this.activityLogService.loadActivityLog())),
      map((activityLog) =>
        ActivityLogActions.activityLogLoaded({ activityLog: Object.values(activityLog) })
      )
    )
  );

  removeCategoryValueChangeRecord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActivityLogActions.removeRecord),
      mergeMap((action) =>
        from(this.activityLogService.removeRecord(action.recordId)).pipe(
          switchMap(() => {
            return of(
              ActivityLogActions.recordRemoved({
                recordId: action.recordId,
              })
            );
          }),
          catchError(() => {
            return of(ActivityLogActions.removeRecordFail({ recordId: action.recordId }));
          })
        )
      )
    )
  );

  bulkRecordsRemove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActivityLogActions.bulkRecordsRemove),
      mergeMap(() =>
        from(this.activityLogService.bulkRecordRemove()).pipe(
          switchMap(() => {
            return of(ActivityLogActions.bulkRecordsRemoved());
          }),
          catchError(() => {
            return of(ActivityLogActions.bulkRecordsRemoveFail());
          })
        )
      )
    )
  );

  cleanStateOnLogOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() => of(ActivityLogActions.cleanState()))
    )
  );
}
