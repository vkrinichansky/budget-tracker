import { Injectable } from '@angular/core';
import { SnackbarHandlerService } from '@budget-tracker/shared';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, from, switchMap, of, catchError, filter, take } from 'rxjs';
import { ActivityLogActions, CategoriesActions, RootValuesActions } from '../actions';
import { Store } from '@ngrx/store';
import { ActivityLogSelectors } from '../selectors';
import { ActivityLogService } from '../../services';
import { RootValueType } from '../../models';

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
            action.updatedBalanceValue,
            action.updatedCategories
          )
        ).pipe(
          switchMap(() => {
            this.snackbarHandler.showActivityLogRecordRemovedSnackbar();

            if (action.updatedBalanceValue !== undefined && action.updatedCategories) {
              return of(
                ActivityLogActions.activityLogRecordRemoved({
                  recordId: action.record.id,
                }),
                RootValuesActions.balanceUpdated({ newBalanceValue: action.updatedBalanceValue }),
                CategoriesActions.categoryValueChanged({ updatedCategory: action.updatedCategory })
              );
            }

            if (action.updatedBalanceValue !== undefined && !action.updatedCategories) {
              return of(
                ActivityLogActions.activityLogRecordRemoved({
                  recordId: action.record.id,
                }),
                RootValuesActions.balanceUpdated({ newBalanceValue: action.updatedBalanceValue })
              );
            }

            return of(
              ActivityLogActions.activityLogRecordRemoved({
                recordId: action.record.id,
              })
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

  removeRootValueChangeRecord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActivityLogActions.removeRootValueChangeRecord),
      mergeMap((action) =>
        from(
          this.activityLogService.removeRootValueChangeRecord(action.record, action.updatedValue, action.valueType)
        ).pipe(
          switchMap(() => {
            this.snackbarHandler.showActivityLogRecordRemovedSnackbar();

            if (action.updatedValue !== undefined) {
              switch (action.valueType) {
                case RootValueType.Balance:
                  return of(
                    ActivityLogActions.activityLogRecordRemoved({
                      recordId: action.record.id,
                    }),
                    RootValuesActions.balanceUpdated({ newBalanceValue: action.updatedValue })
                  );

                case RootValueType.Savings:
                  return of(
                    ActivityLogActions.activityLogRecordRemoved({
                      recordId: action.record.id,
                    }),
                    RootValuesActions.savingsUpdated({ newSavingsValue: action.updatedValue })
                  );

                case RootValueType.FreeMoney:
                  return of(
                    ActivityLogActions.activityLogRecordRemoved({
                      recordId: action.record.id,
                    }),
                    RootValuesActions.freeMoneyUpdated({
                      newFreeMoneyValue: action.updatedValue,
                    })
                  );
              }
            }

            return of(
              ActivityLogActions.activityLogRecordRemoved({
                recordId: action.record.id,
              })
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
            this.snackbarHandler.showBulkActivityLogRecordsRemovedSnackbar(action.records);

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
