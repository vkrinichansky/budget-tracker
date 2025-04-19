import { Injectable } from '@angular/core';
import { AuthActions } from '@budget-tracker/auth';
import { StatisticsSnapshot, Dashboard, Category } from '@budget-tracker/models';
import { getMonthAndYearString, getPreviousMonthTime } from '@budget-tracker/utils';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, from, of, map, tap, combineLatest, take } from 'rxjs';
import {
  CategoriesActions,
  ActivityLogActions,
  AccountsActions,
  DashboardInitActions,
} from '../actions';
import { DashboardInitApiService } from '../../services';
import { Store } from '@ngrx/store';
import { SnackbarHandlerService } from '@budget-tracker/design-system';
import { AccountsSelectors, CategoriesSelectors } from '../selectors';
import { CurrencyFacadeService } from '@budget-tracker/metadata';

@Injectable()
export class DashboardInitEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly dashboardInitService: DashboardInitApiService,
    private readonly store: Store,
    private readonly snackbarHandler: SnackbarHandlerService,
    private readonly currencyFacade: CurrencyFacadeService
  ) {}

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardInitActions.init),
      switchMap(() => from(this.dashboardInitService.initData())),
      map((data: Dashboard) => {
        this.setStates(data);

        if (data.resetDate !== getMonthAndYearString()) {
          return DashboardInitActions.resetData({ data });
        }

        return DashboardInitActions.dataLoaded();
      })
    )
  );

  resetData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardInitActions.resetData),
      switchMap((action) =>
        combineLatest([
          this.store.select(CategoriesSelectors.incomeValueSelector),
          this.store.select(CategoriesSelectors.expenseValueSelector),
          this.store.select(
            CategoriesSelectors.currentMonthBalanceSelector(
              this.currencyFacade.getCurrentCurrency(),
              this.currencyFacade.getCurrentExchangeRate()
            )
          ),
          this.store.select(
            AccountsSelectors.fullBalanceSelector(
              this.currencyFacade.getCurrentCurrency(),
              this.currencyFacade.getCurrentExchangeRate()
            )
          ),
        ]).pipe(
          map(([income, expense, monthBalance, totalBalance]) => ({
            action,
            income,
            expense,
            monthBalance,
            totalBalance,
          })),
          take(1)
        )
      ),
      switchMap(({ action, income, expense, monthBalance, totalBalance }) => {
        const date = getPreviousMonthTime().toString();
        const statisticsSnapshot: StatisticsSnapshot = {
          date,
          categories: [...Object.values(action.data.categories)],
          income,
          expense,
          monthBalance,
          totalBalance,
        };

        const { resetCategories, resetDate } = this.getResetData(action.data);

        return of({
          resetCategories,
          resetDate,
          statisticsSnapshot,
          date,
          initialData: action.data,
        });
      }),
      switchMap(({ resetCategories, resetDate, statisticsSnapshot, date, initialData }) =>
        from(
          this.dashboardInitService.resetData(resetCategories, resetDate, statisticsSnapshot, date)
        ).pipe(
          tap(() => {
            const resultResetData: Dashboard = {
              ...initialData,
              categories: resetCategories,
            };

            this.setStates(resultResetData);
          })
        )
      ),
      map(() => DashboardInitActions.dataLoaded()),
      tap(() => this.snackbarHandler.showDataResetSnackbar())
    )
  );

  cleanStateOnLogOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() =>
        of(CategoriesActions.clean(), ActivityLogActions.clean(), AccountsActions.clean())
      )
    )
  );

  private getResetData(data: Dashboard): {
    resetCategories: Record<string, Category>;
    resetDate: string;
  } {
    const categories = structuredClone(data.categories);
    Object.keys(categories).forEach((categoryId) => (categories[categoryId].value = 0));

    return { resetCategories: categories, resetDate: getMonthAndYearString() };
  }

  private setStates(data: Dashboard) {
    const categories = Object.values(data.categories);
    const accounts = Object.values(data.accounts);
    const activityLog = [...data.activityLog];

    this.store.dispatch(CategoriesActions.categoriesLoaded({ categories }));
    this.store.dispatch(ActivityLogActions.activityLogLoaded({ activityLog }));
    this.store.dispatch(AccountsActions.accountsLoaded({ accounts }));
  }
}
