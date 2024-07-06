import { Injectable } from '@angular/core';
import { SnackbarHandlerService } from '@budget-tracker/shared';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, from, switchMap, of, catchError, filter, take } from 'rxjs';
import { AccountsActions, ActivityLogActions, CategoriesActions } from '../actions';
import { Store } from '@ngrx/store';
import { ActivityLogSelectors } from '../selectors';
import { ActivityLogService } from '../../services';

@Injectable()
export class ActivityLogEffects {
  constructor(
    private actions$: Actions,
    private snackbarHandler: SnackbarHandlerService,
    private store: Store,
    private activityLogService: ActivityLogService
  ) {}

  removeRecord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActivityLogActions.removeRecord),
      mergeMap((action) =>
        this.store.select(ActivityLogSelectors.selectRecordByIdSelector(action.recordId)).pipe(
          filter((record) => !!record),
          take(1)
        )
      ),
      mergeMap((record) =>
        from(this.activityLogService.removeRecord(record)).pipe(
          switchMap(() => {
            this.snackbarHandler.showActivityLogRecordRemovedSnackbar();

            return of(
              ActivityLogActions.activityLogRecordRemoved({
                recordId: record.id,
              })
            );
          }),
          catchError((error) => {
            this.snackbarHandler.showErrorSnackbar(error);

            return of(ActivityLogActions.removeRecordFail({ recordId: record.id }));
          })
        )
      )
    )
  );

  removeCategoryValueChangeRecord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActivityLogActions.removeCategoryValueChangeRecord),
      mergeMap((action) =>
        from(
          this.activityLogService.removeCategoryValueChangeRecord(
            action.record,
            action.updatedAccount,
            action.updatedCategory
          )
        ).pipe(
          switchMap(() => {
            this.snackbarHandler.showActivityLogRecordRemovedSnackbar();

            if (action.updatedAccount) {
              return of(
                ActivityLogActions.activityLogRecordRemoved({
                  recordId: action.record.id,
                }),
                CategoriesActions.categoryValueChanged({ updatedCategory: action.updatedCategory }),
                AccountsActions.accountValueEdited({ updatedAccount: action.updatedAccount })
              );
            }

            return of(
              ActivityLogActions.activityLogRecordRemoved({
                recordId: action.record.id,
              }),
              CategoriesActions.categoryValueChanged({ updatedCategory: action.updatedCategory })
            );
          }),
          catchError((error) => {
            this.snackbarHandler.showErrorSnackbar(error);

            return of(ActivityLogActions.removeRecordFail({ recordId: action.record.id }));
          })
        )
      )
    )
  );

  removeRecordsBySelectedTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActivityLogActions.bulkRecordsRemove),
      mergeMap((action) =>
        from(this.activityLogService.bulkRecordRemove(action.records)).pipe(
          switchMap(() => {
            this.snackbarHandler.showBulkActivityLogRecordsRemovedSnackbar();

            return of(
              ActivityLogActions.bulkRecordsRemoved({
                records: action.records,
              })
            );
          }),
          catchError((error) => {
            this.snackbarHandler.showErrorSnackbar(error);

            return of(ActivityLogActions.bulkRecordsRemoveFail());
          })
        )
      )
    )
  );
}
