import { Injectable } from '@angular/core';
import { AuthActions, AuthSelectors } from '@budget-tracker/auth';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, from, map, mergeMap, take, tap } from 'rxjs';
import { BudgetTrackerActions } from '../actions';
import { CategoriesActions } from '../../modules';
import { RootValuesActions } from '@budget-tracker/dashboard/info-cards';
import { ActivityLogActions } from '@budget-tracker/dashboard/activity-log';
import { BudgetTrackerService } from '@budget-tracker/budget-tracker';

@Injectable()
export class BudgetTrackerEffects {
  constructor(private actions$: Actions, private budgetTrackerService: BudgetTrackerService, private store: Store) {}

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BudgetTrackerActions.init),
      mergeMap(() =>
        this.store.select(AuthSelectors.userSelector).pipe(
          filter((user) => !!user),
          take(1)
        )
      ),
      mergeMap(() => from(this.budgetTrackerService.initData())),
      tap((data) => {
        this.store.dispatch(
          CategoriesActions.categoriesLoaded({
            expense: data.budget.categories.expense,
            income: data.budget.categories.income,
          })
        );

        this.store.dispatch(
          RootValuesActions.rootValuesLoaded({
            balance: data.budget.rootValues.balance,
            savings: data.budget.rootValues.savings,
            freeMoney: data.budget.rootValues.freeMoney,
          })
        );

        this.store.dispatch(
          ActivityLogActions.activityLogLoaded({
            activityLog: data.budget.activityLog,
          })
        );
      }),
      map((data) => BudgetTrackerActions.dataLoaded({ data }))
    )
  );

  cleanStateOnLogOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      map(() => BudgetTrackerActions.clean())
    )
  );
}
