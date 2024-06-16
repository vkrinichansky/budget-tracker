import { Injectable } from '@angular/core';
import { AuthActions } from '@budget-tracker/auth';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { from, map, of, switchMap, tap } from 'rxjs';
import { ActivityLogActions, CategoriesActions, DataInitActions, RootValuesActions } from '../actions';
import { CategoriesService, DataInitService } from '../../services';
import { getMonthAndYearString } from '@budget-tracker/utils';
import { ActivityLogRecordType, BudgetTrackerState, BudgetType, CategoriesResetRecord } from '../../models';
import { v4 as uuid } from 'uuid';

@Injectable()
export class DataInitEffects {
  constructor(
    private actions$: Actions,
    private dataInitService: DataInitService,
    private store: Store,
    private categoryService: CategoriesService
  ) {}

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DataInitActions.init),
      switchMap(() => from(this.dataInitService.initData())),
      tap((data) => {
        const rootValues = { ...data.budget.rootValues };

        this.store.dispatch(
          RootValuesActions.rootValuesLoaded({
            balance: rootValues.balance,
            savings: rootValues.savings,
            freeMoney: rootValues.freeMoney,
          })
        );
      }),
      map((data) => {
        if (data.budget.resetDate === getMonthAndYearString()) {
          this.setStates(data);

          return DataInitActions.dataLoaded();
        }

        return DataInitActions.resetData({ data });
      })
    )
  );

  resetData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DataInitActions.resetData),
      switchMap((action) => of(this.getResetData(action.data))),
      switchMap(({ resetData, activityLogRecords }) =>
        from(this.categoryService.resetData(resetData, activityLogRecords)).pipe(
          tap(() => {
            const resultResetData = {
              ...resetData,
              budget: { ...resetData.budget, activityLog: [...resetData.budget.activityLog, ...activityLogRecords] },
            };

            this.setStates(resultResetData);
          })
        )
      ),
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

  private getResetData(data: BudgetTrackerState): {
    resetData: BudgetTrackerState;
    activityLogRecords: CategoriesResetRecord[];
  } {
    const resetData = structuredClone(data);

    [BudgetType.Income, BudgetType.Expense].forEach((budgetType) => {
      resetData.budget.categories[budgetType] = resetData.budget.categories[budgetType].map((category) => ({
        ...category,
        value: 0,
      }));
    });

    const activityLogRecords: CategoriesResetRecord[] = [
      { budgetType: BudgetType.Income, icon: 'arrow-up' },
      { budgetType: BudgetType.Expense, icon: 'arrow-down' },
    ].map((item) => ({
      budgetType: item.budgetType,
      date: new Date().getTime(),
      id: uuid(),
      recordType: ActivityLogRecordType.CategoriesReset,
      icon: item.icon,
    }));

    resetData.budget.resetDate = getMonthAndYearString();
    return { resetData, activityLogRecords };
  }

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
