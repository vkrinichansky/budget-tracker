import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, from, map, mergeMap, of, switchMap } from 'rxjs';
import { AccountsActions, ActivityLogActions, CategoriesActions } from '../actions';
import { CategoriesService } from '../../services';
import { Account, Category } from '@budget-tracker/models';
import { SnackbarHandlerService } from '@budget-tracker/design-system';

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
        from(this.categoriesService.addCategory(action.category)).pipe(
          switchMap(() => {
            this.snackbarHandler.showCategoryAddedSnackbar();

            return of(
              CategoriesActions.categoryAdded({
                category: action.category,
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
        from(this.categoriesService.removeCategory(action.categoryId)).pipe(
          switchMap(() => {
            this.snackbarHandler.showCategoryRemovedSnackbar();

            return of(
              CategoriesActions.categoryRemoved({
                categoryId: action.categoryId,
              })
            );
          }),
          catchError((error) => {
            this.snackbarHandler.showErrorSnackbar(error);

            return of(CategoriesActions.removeCategoryFail({ categoryId: action.categoryId }));
          })
        )
      )
    )
  );

  resetCategoryManagementProp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoriesActions.categoryAdded, CategoriesActions.categoryRemoved),
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
            action.updatedCategoryId,
            action.updatedCategoryValue,
            action.updatedAccountId,
            action.updatedAccountValue,
            action.activityLogRecord
          )
        ).pipe(
          switchMap(() => {
            this.snackbarHandler.showCategoryValueChangedSnackbar();

            return of(
              CategoriesActions.categoryValueChanged({
                updatedCategory: {
                  id: action.updatedCategoryId,
                  value: action.updatedCategoryValue,
                } as Category,
              }),
              AccountsActions.accountValueEdited({
                updatedAccount: {
                  id: action.updatedAccountId,
                  value: action.updatedAccountValue,
                } as Account,
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
        from(
          this.categoriesService.resetCategories(
            action.categoriesIdsToReset,
            action.activityLogRecord
          )
        ).pipe(
          switchMap(() => {
            this.snackbarHandler.showCategoriesResetSnackbar(action.budgetType);

            return of(
              CategoriesActions.categoriesReset({
                categoriesIdsToReset: action.categoriesIdsToReset,
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
      ofType(CategoriesActions.categoryValueChanged),
      delay(1000),
      map(() => CategoriesActions.resetCategoryValueChangeProp())
    )
  );
}
