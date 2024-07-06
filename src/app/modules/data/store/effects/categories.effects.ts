import { Injectable } from '@angular/core';
import { SnackbarHandlerService } from '@budget-tracker/shared';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, from, map, mergeMap, of, switchMap } from 'rxjs';
import { AccountsActions, ActivityLogActions, CategoriesActions } from '../actions';
import { CategoriesService } from '../../services';

@Injectable()
export class CategoriesEffects {
  constructor(
    private actions$: Actions,
    private categoriesService: CategoriesService,
    private snackbarHandler: SnackbarHandlerService
  ) {}

  addCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoriesActions.addCategory),
      mergeMap((action) =>
        from(this.categoriesService.addCategory(action.category, action.activityLogRecord)).pipe(
          switchMap(() => {
            this.snackbarHandler.showCategoryAddedSnackbar();

            return of(
              CategoriesActions.categoryAdded({
                category: action.category,
              }),

              ActivityLogActions.recordAdded({
                record: action.activityLogRecord,
              })
            );
          }),
          catchError((error) => {
            this.snackbarHandler.showErrorSnackbar(error);

            return of(CategoriesActions.addCategoryFail());
          })
        )
      )
    )
  );

  removeCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoriesActions.removeCategory),
      mergeMap((action) =>
        from(
          this.categoriesService.removeCategory(action.category, action.activityLogRecord, action.recordsToRemove)
        ).pipe(
          switchMap(() => {
            this.snackbarHandler.showCategoryRemovedSnackbar();

            return of(
              CategoriesActions.categoryRemoved({
                category: action.category,
              }),
              ActivityLogActions.recordAdded({
                record: action.activityLogRecord,
              }),
              ActivityLogActions.bulkRecordsRemoved({
                records: action.recordsToRemove,
              })
            );
          }),
          catchError((error) => {
            this.snackbarHandler.showErrorSnackbar(error);

            return of(CategoriesActions.removeCategoryFail({ categoryId: action.category.id }));
          })
        )
      )
    )
  );

  resetCategoryManagementProp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        CategoriesActions.categoryAdded,
        CategoriesActions.addCategoryFail,
        CategoriesActions.categoryRemoved,
        CategoriesActions.removeCategoryFail
      ),
      delay(1000),
      map(() => CategoriesActions.resetCategoryManagementProp())
    )
  );

  changeCategoryValue$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoriesActions.changeCategoryValue),
      mergeMap((action) =>
        from(
          this.categoriesService.changeCategoryValue(
            action.updatedCategory,
            action.updatedAccount,
            action.activityLogRecord
          )
        ).pipe(
          switchMap(() => {
            this.snackbarHandler.showCategoryValueChangedSnackbar();

            return of(
              CategoriesActions.categoryValueChanged({
                updatedCategory: action.updatedCategory,
              }),
              AccountsActions.accountValueEdited({
                updatedAccount: action.updatedAccount,
              }),
              ActivityLogActions.recordAdded({
                record: action.activityLogRecord,
              })
            );
          }),
          catchError((error) => {
            this.snackbarHandler.showErrorSnackbar(error);

            return of(CategoriesActions.changeCategoryValueFail());
          })
        )
      )
    )
  );

  resetCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoriesActions.resetCategories),
      mergeMap((action) =>
        from(this.categoriesService.resetCategories(action.updatedCategories, action.activityLogRecord)).pipe(
          switchMap(() => {
            this.snackbarHandler.showCategoriesResetSnackbar(action.updatedCategories[0].budgetType);

            return of(
              CategoriesActions.categoriesReset({
                updatedCategories: action.updatedCategories,
              }),
              ActivityLogActions.recordAdded({
                record: action.activityLogRecord,
              })
            );
          }),
          catchError((error) => {
            this.snackbarHandler.showErrorSnackbar(error);

            return of(CategoriesActions.resetCategoriesFail());
          })
        )
      )
    )
  );

  resetCategoryValueChangeProp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoriesActions.categoryValueChanged, CategoriesActions.changeCategoryValueFail),
      delay(1000),
      map(() => CategoriesActions.resetCategoryValueChangeProp())
    )
  );
}
