import { Injectable } from '@angular/core';
import { AuthActions } from '@budget-tracker/auth';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { from, map, of, switchMap, tap } from 'rxjs';
import {
  ActivityLogActions,
  CategoriesActions,
  DataInitActions,
  RootValuesActions,
  StatisticsActions,
} from '../actions';
import { CategoriesService, DataInitService } from '../../services';
import { getMonthAndYearString, getPreviousMonthTime } from '@budget-tracker/utils';
import {
  ActivityLogRecordType,
  BudgetTrackerState,
  BudgetType,
  CategoriesResetRecord,
  StatisticsSnapshot,
} from '../../models';
import { v4 as uuid } from 'uuid';
import { SnackbarHandlerService } from '@budget-tracker/shared';

@Injectable()
export class DataInitEffects {
  constructor(
    private actions$: Actions,
    private dataInitService: DataInitService,
    private store: Store,
    private categoryService: CategoriesService,
    private snackbarHandler: SnackbarHandlerService
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
        if (data.resetDate !== getMonthAndYearString() && data.shouldDoReset) {
          return DataInitActions.resetData({ data });
        }

        this.setStates(data);

        return DataInitActions.dataLoaded();
      })
    )
  );

  resetData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DataInitActions.resetData),
      switchMap((action) => {
        const { resetData, activityLogRecords } = this.getResetData(action.data);
        const date = getPreviousMonthTime().toString();

        const statisticsSnapshot: StatisticsSnapshot = {
          date,
          categories: [
            ...action.data.budget.categories.income.filter((category) => category.budgetType === BudgetType.Income),
            ...action.data.budget.categories.expense.filter((category) => category.budgetType === BudgetType.Expense),
          ],
        };

        return of({ resetData, activityLogRecords, statisticsSnapshot, date, initialData: action.data });
      }),

      switchMap(({ resetData, activityLogRecords, statisticsSnapshot, date, initialData }) =>
        from(this.dataInitService.resetData(resetData, activityLogRecords, statisticsSnapshot, date)).pipe(
          tap(() => {
            const resultResetData: BudgetTrackerState = {
              ...resetData,
              budget: { ...resetData.budget, activityLog: [...resetData.budget.activityLog, ...activityLogRecords] },
              statistics: {
                ...resetData.statistics,
                snapshots: { ...initialData.statistics.snapshots, [date]: statisticsSnapshot },
              },
            };

            this.setStates(resultResetData);
          })
        )
      ),
      map(() => DataInitActions.dataLoaded()),
      tap(() => this.snackbarHandler.showDataResetSnackbar())
    )
  );

  cleanStateOnLogOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() =>
        of(
          DataInitActions.clean(),
          CategoriesActions.clean(),
          ActivityLogActions.clean(),
          RootValuesActions.clean(),
          StatisticsActions.clean()
        )
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

    resetData.resetDate = getMonthAndYearString();
    return { resetData, activityLogRecords };
  }

  private setStates(data: BudgetTrackerState) {
    const categories = { ...data.budget.categories };
    const activityLog = [...data.budget.activityLog];
    const statistics = structuredClone(data.statistics);
    const resetDate = data.resetDate;

    this.store.dispatch(
      CategoriesActions.categoriesLoaded({
        expense: categories.expense,
        income: categories.income,
      })
    );

    this.store.dispatch(ActivityLogActions.activityLogLoaded({ activityLog }));
    this.store.dispatch(DataInitActions.resetDateLoaded({ resetDate }));
    this.store.dispatch(StatisticsActions.statisticsLoaded({ statistics }));
  }
}
