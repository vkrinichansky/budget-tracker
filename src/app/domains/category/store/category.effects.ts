import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, map, mergeMap, of, switchMap, take } from 'rxjs';
import { Category } from '@budget-tracker/models';
import { MetadataActions, MetadataService } from '@budget-tracker/metadata';
import { CategorySelectors } from './category.selectors';
import { Store } from '@ngrx/store';
import { CategoryApiService } from '../services';
import { CategoryActions } from './category.actions';
import { AuthActions } from '@budget-tracker/auth';

@Injectable()
export class CategoryEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly categoryService: CategoryApiService,
    private readonly store: Store,
    private readonly metadataService: MetadataService
  ) {}

  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.loadCategories),
      switchMap(() => from(this.categoryService.loadCategories())),
      map((categories) =>
        CategoryActions.categoriesLoaded({ categories: Object.values(categories) })
      )
    )
  );

  addCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.addCategory),
      mergeMap((action) =>
        from(this.categoryService.addCategory(action.category)).pipe(
          switchMap(() => {
            return of(
              CategoryActions.categoryAdded({
                category: action.category,
              })
            );
          }),
          catchError(() => {
            return of(CategoryActions.addCategoryFail());
          })
        )
      )
    )
  );

  removeCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.removeCategory),
      mergeMap((action) =>
        from(this.categoryService.removeCategory(action.categoryId)).pipe(
          switchMap(() => {
            return of(
              CategoryActions.categoryRemoved({
                categoryId: action.categoryId,
              })
            );
          }),
          catchError(() => {
            return of(CategoryActions.removeCategoryFail({ categoryId: action.categoryId }));
          })
        )
      )
    )
  );

  changeCategoryValue$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.changeCategoryValue),
      mergeMap((action) =>
        from(
          this.categoryService.changeCategoryValue(
            action.updatedCategoryId,
            action.updatedCategoryValue
          )
        ).pipe(
          switchMap(() => {
            return of(
              CategoryActions.categoryValueChanged({
                updatedCategory: {
                  id: action.updatedCategoryId,
                  value: action.updatedCategoryValue,
                } as Category,
              })
            );
          }),
          catchError(() => {
            return of(CategoryActions.changeCategoryValueFail());
          })
        )
      )
    )
  );

  resetCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.resetCategories),
      mergeMap((action) =>
        from(this.categoryService.resetCategories(action.categoriesIdsToReset)).pipe(
          switchMap(() => {
            return of(
              CategoryActions.categoriesReset({
                categoriesIdsToReset: action.categoriesIdsToReset,
              })
            );
          }),
          catchError(() => {
            return of(CategoryActions.resetCategoriesFail());
          })
        )
      )
    )
  );

  updateCategoriesAfterCurrencyChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MetadataActions.updateCategoriesAfterCurrencyChange),
      mergeMap((action) =>
        this.store.select(CategorySelectors.allCategoriesSelector).pipe(
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
        from(this.categoryService.updateCategoriesAfterCurrencyChange(updatedCategories)).pipe(
          switchMap(() => of(MetadataActions.updateCategoriesAfterCurrencyChangeSuccess())),
          catchError(() => of(MetadataActions.updateCategoriesAfterCurrencyChangeFail()))
        )
      )
    )
  );

  cleanStateOnLogOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() => of(CategoryActions.cleanState()))
    )
  );
}
