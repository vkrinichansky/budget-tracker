import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, EMPTY, from, map, mergeMap, of, switchMap, tap, timeout } from 'rxjs';
import { CategoryEvents } from '../models';
import { CategoryApiService } from '../services';
import { CategoryActions } from './category.actions';
import { AuthActions } from '@budget-tracker/auth';
import { EventBusService } from '@budget-tracker/shared-utils';
import { Store } from '@ngrx/store';

const REQUEST_TIMEOUT = 5000;

@Injectable()
export class CategoryEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly categoryService: CategoryApiService,
    private readonly eventBus: EventBusService,
    private readonly store: Store
  ) {}

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

  addCategory$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CategoryActions.addCategory),
        mergeMap((action) =>
          from(this.categoryService.addCategory(action.category)).pipe(
            timeout(REQUEST_TIMEOUT),
            tap(() => {
              this.eventBus.emit({
                type: CategoryEvents.CREATE_CATEGORY,
                status: 'success',
              });

              this.store.dispatch(
                CategoryActions.categoryAdded({
                  category: action.category,
                })
              );
            }),
            catchError(() => {
              this.eventBus.emit({
                type: CategoryEvents.CREATE_CATEGORY,
                status: 'error',
                errorCode: 'errors.category.createCategoryFailed',
              });

              return EMPTY;
            })
          )
        )
      ),
    { dispatch: false }
  );

  removeCategory$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CategoryActions.removeCategory),
        mergeMap((action) =>
          from(this.categoryService.removeCategory(action.categoryId)).pipe(
            timeout(REQUEST_TIMEOUT),
            tap(() => {
              this.eventBus.emit({
                type: CategoryEvents.REMOVE_CATEGORY,
                status: 'success',
                operationId: action.categoryId,
              });

              this.store.dispatch(
                CategoryActions.categoryRemoved({
                  categoryId: action.categoryId,
                })
              );
            }),
            catchError(() => {
              this.eventBus.emit({
                type: CategoryEvents.REMOVE_CATEGORY,
                status: 'error',
                errorCode: 'errors.category.removeCategoryFailed',
                operationId: action.categoryId,
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
