import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, from, switchMap, of, catchError } from 'rxjs';
import { AccountsActions, ActivityLogActions, CategoriesActions } from '../actions';
import { ActivityLogApiService } from '../../services';
import { Account, Category } from '@budget-tracker/models';

@Injectable()
export class ActivityLogEffects {
  constructor(
    private actions$: Actions,
    private activityLogService: ActivityLogApiService
  ) {}

  removeCategoryValueChangeRecord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActivityLogActions.removeCategoryValueChangeRecord),
      mergeMap((action) =>
        from(
          this.activityLogService.removeCategoryValueChangeRecord(
            action.record,
            action.updatedAccountId,
            action.updatedAccountValue,
            action.updatedCategoryId,
            action.updatedCategoryValue
          )
        ).pipe(
          switchMap(() => {
            const updatedCategory = {
              id: action.updatedCategoryId,
              value: action.updatedCategoryValue,
            } as Category;

            return of(
              ActivityLogActions.activityLogRecordRemoved({
                recordId: action.record.id,
              }),
              CategoriesActions.categoryValueChanged({
                updatedCategory,
              }),
              AccountsActions.accountValueEdited({
                updatedAccount: {
                  id: action.updatedAccountId,
                  value: action.updatedAccountValue,
                } as Account,
              })
            );
          }),
          catchError(() => {
            return of(ActivityLogActions.removeRecordFail({ recordId: action.record.id }));
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
}
