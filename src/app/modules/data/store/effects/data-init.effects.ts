import { Injectable } from '@angular/core';
import { AuthActions } from '@budget-tracker/auth';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { from, map, of, switchMap, tap } from 'rxjs';
import { ActivityLogActions, CategoriesActions, DataInitActions, RootValuesActions } from '../actions';
import { DataInitService } from '../../services';
import { getMonthAndYearString } from '@budget-tracker/utils';
import { BudgetTrackerState } from '../../models';

@Injectable()
export class DataInitEffects {
  constructor(
    private actions$: Actions,
    private dataInitService: DataInitService,
    private store: Store
  ) {}

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DataInitActions.init),
      switchMap(() => from(this.dataInitService.initData())),
      tap((data) => {
        const rootValues = { ...data.budget.rootValues };
        // const categories = { ...data.budget.categories };
        // const activityLog = [...data.budget.activityLog];
        const resetDate = data.budget.resetDate;
        console.log('reseteDate', resetDate);

        // this.store.dispatch(
        //   CategoriesActions.categoriesLoaded({
        //     expense: categories.expense,
        //     income: categories.income,
        //   })
        // );

        this.store.dispatch(
          RootValuesActions.rootValuesLoaded({
            balance: rootValues.balance,
            savings: rootValues.savings,
            freeMoney: rootValues.freeMoney,
          })
        );

        // this.store.dispatch(ActivityLogActions.activityLogLoaded({ activityLog }));

        // this.store.dispatch(DataInitActions.resetDateLoaded({ resetDate }));
      }),
      map((data) => {
        console.log('CONDITION', data.budget.resetDate === getMonthAndYearString());
        if (data.budget.resetDate === getMonthAndYearString()) {
          this.setStates(data);

          return DataInitActions.dataLoaded();
        }

        return DataInitActions.resetData({ data });
      })
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

  private setStates(data: BudgetTrackerState) {
    const categories = { ...data.budget.categories };
    const activityLog = [...data.budget.activityLog];
    const resetDate = data.budget.resetDate;

    this.store.dispatch(
      CategoriesActions.categoriesLoaded({
        expense: categories.expense,
        income: categories.income,
      })
    );

    this.store.dispatch(ActivityLogActions.activityLogLoaded({ activityLog }));

    this.store.dispatch(DataInitActions.resetDateLoaded({ resetDate }));
  }
}
