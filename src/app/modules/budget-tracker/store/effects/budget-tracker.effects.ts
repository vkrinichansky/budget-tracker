import { Injectable } from '@angular/core';
import { AuthActions, AuthSelectors } from '@budget-tracker/auth';
import { SnackbarHandlerService } from '@budget-tracker/shared';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, delay, filter, from, map, mergeMap, of, take } from 'rxjs';
import { BudgetTrackerService } from '../../services';
import { BudgetTrackerActions } from '../actions';

@Injectable()
export class BudgetTrackerEffects {
  constructor(
    private actions$: Actions,
    private budgetTrackerService: BudgetTrackerService,
    private store: Store,
    private snackbarHandler: SnackbarHandlerService
  ) {}

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
      map((data) => BudgetTrackerActions.dataLoaded({ data }))
    )
  );

  cleanStateOnLogOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      map(() => BudgetTrackerActions.clean())
    )
  );

  updateBalance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BudgetTrackerActions.updateBalance),
      mergeMap((action) =>
        from(this.budgetTrackerService.updateBalance(action.newBalanceValue, action.activityLogRecord)).pipe(
          map(() => {
            this.snackbarHandler.showBalanceEditedSnackbar();
            return BudgetTrackerActions.balanceUpdated({
              newBalanceValue: action.newBalanceValue,
              activityLogRecord: action.activityLogRecord,
            });
          }),
          catchError((error) => {
            this.snackbarHandler.showErrorSnackbar(error);

            return of(BudgetTrackerActions.balanceUpdateFail());
          })
        )
      )
    )
  );

  updateSavings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BudgetTrackerActions.updateSavings),
      mergeMap((action) =>
        from(this.budgetTrackerService.updateSavings(action.newSavingsValue, action.activityLogRecord)).pipe(
          map(() => {
            this.snackbarHandler.showSavingsEditedSnackbar();
            return BudgetTrackerActions.savingsUpdated({
              newSavingsValue: action.newSavingsValue,
              activityLogRecord: action.activityLogRecord,
            });
          }),
          catchError((error) => {
            this.snackbarHandler.showErrorSnackbar(error);

            return of(BudgetTrackerActions.savingsUpdateFail());
          })
        )
      )
    )
  );

  updateFreeMoney$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BudgetTrackerActions.updateFreeMoney),
      mergeMap((action) =>
        from(this.budgetTrackerService.updateFreeMoney(action.newFreeMoneyValue, action.activityLogRecord)).pipe(
          map(() => {
            this.snackbarHandler.showFreeMoneyEditedSnackbar();
            return BudgetTrackerActions.freeMoneyUpdated({
              newFreeMoneyValue: action.newFreeMoneyValue,
              activityLogRecord: action.activityLogRecord,
            });
          }),
          catchError((error) => {
            this.snackbarHandler.showErrorSnackbar(error);

            return of(BudgetTrackerActions.freeMoneyUpdateFail());
          })
        )
      )
    )
  );

  resetValueUpdatingProp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        BudgetTrackerActions.balanceUpdated,
        BudgetTrackerActions.balanceUpdateFail,
        BudgetTrackerActions.savingsUpdated,
        BudgetTrackerActions.savingsUpdateFail,
        BudgetTrackerActions.freeMoneyUpdated,
        BudgetTrackerActions.freeMoneyUpdateFail
      ),
      delay(1000),
      map(() => BudgetTrackerActions.resetValueUpdatingProp())
    )
  );
}
