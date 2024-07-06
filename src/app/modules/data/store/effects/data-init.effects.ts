import { Injectable } from '@angular/core';
import { AuthActions } from '@budget-tracker/auth';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, from, map, of, switchMap, tap } from 'rxjs';
import { AccountsActions, ActivityLogActions, CategoriesActions, DataInitActions, StatisticsActions } from '../actions';
import { DataInitService } from '../../services';
import {
  CurrencyService,
  getMonthAndYearString,
  getPreviousMonthTime,
  LanguageService,
  SnackbarHandlerService,
} from '@budget-tracker/utils';
import {
  ActivityLogRecordType,
  BudgetTrackerState,
  BudgetType,
  CategoriesResetRecord,
  StatisticsSnapshot,
} from '../../models';
import { v4 as uuid } from 'uuid';

@Injectable()
export class DataInitEffects {
  constructor(
    private actions$: Actions,
    private dataInitService: DataInitService,
    private store: Store,
    private snackbarHandler: SnackbarHandlerService,
    private currencyService: CurrencyService,
    private languageService: LanguageService
  ) {}

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DataInitActions.init),
      switchMap(() =>
        combineLatest([from(this.dataInitService.initData()), from(this.dataInitService.initMetadata())])
      ),
      map(([data, metadata]) => {
        this.currencyService.setCurrentCurrency(metadata.currency);
        this.languageService.setCurrentLanguage(metadata.language);

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
          categories: [...Object.values(action.data.budget.categories)],
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
          StatisticsActions.clean(),
          AccountsActions.clean()
        )
      )
    )
  );

  private getResetData(data: BudgetTrackerState): {
    resetData: BudgetTrackerState;
    activityLogRecords: CategoriesResetRecord[];
  } {
    const resetData = structuredClone(data);

    Object.keys(resetData.budget.categories).forEach(
      (categoryId) => (resetData.budget.categories[categoryId].value = 0)
    );

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
    const categories = Object.values(data.budget.categories);
    const accounts = Object.values(data.budget.accounts);
    const activityLog = [...data.budget.activityLog];
    const statistics = structuredClone(data.statistics);
    const resetDate = data.resetDate;

    this.store.dispatch(
      CategoriesActions.categoriesLoaded({
        categories,
      })
    );

    this.store.dispatch(ActivityLogActions.activityLogLoaded({ activityLog }));
    this.store.dispatch(DataInitActions.resetDateLoaded({ resetDate }));
    this.store.dispatch(StatisticsActions.statisticsLoaded({ statistics }));
    this.store.dispatch(AccountsActions.accountsLoaded({ accounts }));
  }
}
