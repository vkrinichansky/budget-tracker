import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, map, mergeMap, of, switchMap, take } from 'rxjs';
import { CategoriesApiService } from '../../services';
import {
  Account,
  Category,
  // createCurrencyChangeRecord,
  // CurrencyChangeRecord,
} from '@budget-tracker/models';
import { AccountsActions, CategoriesActions } from '../actions';
import { MetadataActions, MetadataService } from '@budget-tracker/metadata';
import { CategoriesSelectors } from '../selectors';
import { Store } from '@ngrx/store';

@Injectable()
export class CategoriesEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly categoriesService: CategoriesApiService,
    private readonly store: Store,
    private readonly metadataService: MetadataService
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
            action.updatedAccountValue
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
        from(this.categoriesService.resetCategories(action.categoriesIdsToReset)).pipe(
          switchMap(() => {
            return of(
              CategoriesActions.categoriesReset({
                categoriesIdsToReset: action.categoriesIdsToReset,
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

  updateCategoriesAfterCurrencyChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MetadataActions.updateCategoriesAfterCurrencyChange),
      mergeMap((action) =>
        this.store.select(CategoriesSelectors.allCategoriesSelector).pipe(
          take(1),
          map((categories) => {
            const updatedCategories = structuredClone(categories);

            updatedCategories.forEach((category) => {
              category.value = this.metadataService.convertCurrency(
                category.value,
                this.metadataService.currentCurrency,
                action.newCurrency
              );
            });

            return updatedCategories;
          })
        )
      ),
      mergeMap((updatedCategories) =>
        from(this.categoriesService.updateCategoriesAfterCurrencyChange(updatedCategories)).pipe(
          switchMap(() => of(MetadataActions.updateCategoriesAfterCurrencyChangeSuccess())),
          catchError(() => of(MetadataActions.updateCategoriesAfterCurrencyChangeFail()))
        )
      )
    )
  );
}
