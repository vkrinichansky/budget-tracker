import { Injectable } from '@angular/core';
import { AuthActions, AuthSelectors } from '@budget-tracker/auth';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, from, map, mergeMap, of, take, tap } from 'rxjs';
import { ActivityLogActions, CategoriesActions, DataInitActions, RootValuesActions } from '../actions';
import { DataInitService } from '../../services';

@Injectable()
export class DataInitEffects {
  constructor(private actions$: Actions, private dataInitService: DataInitService, private store: Store) {}

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DataInitActions.init),
      mergeMap(() =>
        this.store.select(AuthSelectors.userSelector).pipe(
          filter((user) => !!user),
          take(1)
        )
      ),
      mergeMap(() => from(this.dataInitService.initData())),
      tap((data) => {
        const categories = { ...data.budget.categories };
        const rootValues = { ...data.budget.rootValues };
        const activityLog = [...data.budget.activityLog];

        this.store.dispatch(
          CategoriesActions.categoriesLoaded({
            expense: categories.expense,
            income: categories.income,
          })
        );

        this.store.dispatch(
          RootValuesActions.rootValuesLoaded({
            balance: rootValues.balance,
            savings: rootValues.savings,
            freeMoney: rootValues.freeMoney,
          })
        );

        this.store.dispatch(ActivityLogActions.activityLogLoaded({ activityLog }));
      }),
      map((data) => DataInitActions.dataLoaded({ data }))
    )
  );

  cleanStateOnLogOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      mergeMap(() =>
        of(DataInitActions.clean(), CategoriesActions.clean(), ActivityLogActions.clean(), RootValuesActions.clean())
      )
    )
  );
}
