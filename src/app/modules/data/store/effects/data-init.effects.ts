import { Injectable } from '@angular/core';
import { AuthActions } from '@budget-tracker/auth';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { from, map, of, switchMap, tap } from 'rxjs';
import { ActivityLogActions, CategoriesActions, DataInitActions, RootValuesActions } from '../actions';
import { DataInitService } from '../../services';

@Injectable()
export class DataInitEffects {
  constructor(private actions$: Actions, private dataInitService: DataInitService, private store: Store) {}

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DataInitActions.init),
      switchMap(() => from(this.dataInitService.initData())),
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
      map(() => DataInitActions.dataLoaded())
    )
  );

  cleanStateOnLogOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() =>
        of(DataInitActions.clean(), CategoriesActions.clean(), ActivityLogActions.clean(), RootValuesActions.clean())
      )
    )
  );
}
