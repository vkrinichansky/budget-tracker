import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, EMPTY, from, map, mergeMap, of, switchMap, tap, timeout } from 'rxjs';
import { Category, CategoryEvents } from '../models';
import { CategoryApiService } from '../services';
import { CategoryActions } from './category.actions';
import { AuthActions } from '@budget-tracker/auth';
import { EventBusService } from '@budget-tracker/utils';

const REQUEST_TIMEOUT = 5000;

@Injectable()
export class CategoryEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly categoryService: CategoryApiService,
    private readonly eventBus: EventBusService
  ) {}

  initCategoryDB$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CategoryActions.initCategoryDB),
        switchMap(() =>
          from(this.categoryService.initCategoryDB()).pipe(
            timeout(REQUEST_TIMEOUT),
            tap(() =>
              this.eventBus.emit({
                type: CategoryEvents.INIT_CATEGORY_DB,
                status: 'success',
              })
            ),
            catchError(() => {
              this.eventBus.emit({
                type: CategoryEvents.INIT_CATEGORY_DB,
                status: 'error',
                errorCode: 'category.initCategoryDBFailed',
              });

              return EMPTY;
            })
          )
        )
      ),
    { dispatch: false }
  );

  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.loadCategories),
      switchMap(() =>
        from(this.categoryService.loadCategories()).pipe(
          timeout(REQUEST_TIMEOUT),
          map((categories) =>
            CategoryActions.categoriesLoaded({ categories: Object.values(categories) })
          )
        )
      )
    )
  );

  addCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.addCategory),
      mergeMap((action) =>
        from(this.categoryService.addCategory(action.category)).pipe(
          timeout(REQUEST_TIMEOUT),
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
          timeout(REQUEST_TIMEOUT),
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
          timeout(REQUEST_TIMEOUT),
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
          timeout(REQUEST_TIMEOUT),
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

  updateCategories$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CategoryActions.updateCategories),
        mergeMap((action) =>
          from(this.categoryService.updateCategories(action.categories)).pipe(
            timeout(REQUEST_TIMEOUT),
            tap(() => {
              this.eventBus.emit({
                type: CategoryEvents.UPDATE_CATEGORIES,
                status: 'success',
              });
            }),
            catchError(() => {
              this.eventBus.emit({
                type: CategoryEvents.UPDATE_CATEGORIES,
                status: 'error',
                errorCode: 'category.updateCategoriesFailed',
              });

              return EMPTY;
            })
          )
        )
      ),
    { dispatch: false }
  );

  cleanStateOnLogOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() => of(CategoryActions.cleanState()))
    )
  );
}
