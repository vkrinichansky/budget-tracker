import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, mergeMap, of, switchMap } from 'rxjs';
import { CategoriesApiService } from '../../services';
import { Account, Category } from '@budget-tracker/models';
import { AccountsActions, ActivityLogActions, CategoriesActions } from '../actions';

@Injectable()
export class CategoriesEffects {
  constructor(
    private actions$: Actions,
    private categoriesService: CategoriesApiService
  ) {}

  addCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoriesActions.addCategory),
      mergeMap((action) =>
        from(this.categoriesService.addCategory(action.category)).pipe(
          switchMap(() => {
            return of(
              CategoriesActions.categoryAdded({
                category: action.category,
              })
            );
          }),
          catchError(() => {
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
            return of(
              CategoriesActions.categoryRemoved({
                categoryId: action.categoryId,
              })
            );
          }),
          catchError(() => {
            return of(CategoriesActions.removeCategoryFail({ categoryId: action.categoryId }));
          })
        )
      )
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
          catchError(() => {
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
            return of(
              CategoriesActions.categoriesReset({
                categoriesIdsToReset: action.categoriesIdsToReset,
              }),
              ActivityLogActions.recordAdded({
                record: action.activityLogRecord,
              })
            );
          }),
          catchError(() => {
            return of(CategoriesActions.resetCategoriesFail());
          })
        )
      )
    )
  );
}
