import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, from, switchMap, of, catchError, map } from 'rxjs';
import { ActivityLogActions } from './activity-log.actions';
import { ActivityLogApiService } from '../services';
import { AuthActions } from '@budget-tracker/auth';

@Injectable()
export class ActivityLogEffects {
  constructor(
    private actions$: Actions,
    private activityLogService: ActivityLogApiService
  ) {}

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
