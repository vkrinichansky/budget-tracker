import { Injectable } from '@angular/core';

@Injectable()
export class DashboardInitEffects {
  constructor() {}

  // resetData$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(DashboardInitActions.resetData),
  //     switchMap((action) =>
  //       combineLatest([
  //         this.store.select(CategoriesSelectors.incomeValueSelector),
  //         this.store.select(CategoriesSelectors.expenseValueSelector),
  //         this.store.select(CategoriesSelectors.currentMonthBalanceSelector),
  //         this.store.select(
  //           AccountsSelectors.fullBalanceSelector(
  //             this.metadataService.currentCurrency,
  //             this.metadataService.currencyExchangeRate
  //           )
  //         ),
  //       ]).pipe(
  //         map(([income, expense, monthBalance, fullBalance]) => ({
  //           action,
  //           income,
  //           expense,
  //           monthBalance,
  //           fullBalance,
  //         })),
  //         take(1)
  //       )
  //     ),
  //     switchMap(({ action, income, expense, monthBalance, fullBalance }) => {
  //       const date = getPreviousMonthTime().toString();
  //       const statisticsSnapshot: StatisticsSnapshot = {
  //         date,
  //         categories: [...Object.values(action.data.categories)],
  //         income,
  //         expense,
  //         monthBalance,
  //         fullBalance,
  //         currency: this.metadataService.currentCurrency,
  //       };

  //       const { resetCategories, resetDate } = this.getResetData(action.data);

  //       return of({
  //         resetCategories,
  //         resetDate,
  //         statisticsSnapshot,
  //         date,
  //         initialData: action.data,
  //       });
  //     }),
  //     switchMap(({ resetCategories, resetDate, statisticsSnapshot, date, initialData }) =>
  //       from(
  //         this.dashboardInitService.resetData(resetCategories, resetDate, statisticsSnapshot, date)
  //       ).pipe(
  //         tap(() => {
  //           const resultResetData: Dashboard = {
  //             ...initialData,
  //             categories: resetCategories,
  //           };

  //           this.setStates(resultResetData);
  //         })
  //       )
  //     ),
  //     map(() => DashboardInitActions.dashboardDataLoaded()),
  //     tap(() => this.snackbarHandler.showMessageSnackbar('messages.dataReset'))
  //   )
  // );

  // private getResetData(data: Dashboard): {
  //   resetCategories: Record<string, Category>;
  //   resetDate: string;
  // } {
  //   const categories = structuredClone(data.categories);
  //   Object.keys(categories).forEach((categoryId) => (categories[categoryId].value = 0));

  //   return { resetCategories: categories, resetDate: getMonthAndYearString() };
  // }
}
