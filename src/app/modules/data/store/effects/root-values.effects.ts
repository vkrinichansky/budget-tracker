import { Injectable } from '@angular/core';
import { SnackbarHandlerService } from '@budget-tracker/shared';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, from, map, mergeMap, of, switchMap } from 'rxjs';
import { RootValuesService } from '../../services';
import { ActivityLogActions, RootValuesActions } from '../actions';

@Injectable()
export class RootValuesEffects {
  constructor(
    private actions$: Actions,
    private rootValuesService: RootValuesService,
    private snackbarHandler: SnackbarHandlerService
  ) {}

  updateBalance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RootValuesActions.updateBalance),
      mergeMap((action) =>
        from(this.rootValuesService.updateBalance(action.newBalanceValue, action.activityLogRecord)).pipe(
          switchMap(() => {
            this.snackbarHandler.showBalanceEditedSnackbar();

            return of(
              RootValuesActions.balanceUpdated({
                newBalanceValue: action.newBalanceValue,
              }),
              ActivityLogActions.recordAdded({ record: action.activityLogRecord })
            );
          }),
          catchError((error) => {
            this.snackbarHandler.showErrorSnackbar(error);

            return of(RootValuesActions.balanceUpdateFail());
          })
        )
      )
    )
  );

  updateSavings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RootValuesActions.updateSavings),
      mergeMap((action) =>
        from(this.rootValuesService.updateSavings(action.newSavingsValue, action.activityLogRecord)).pipe(
          switchMap(() => {
            this.snackbarHandler.showSavingsEditedSnackbar();

            return of(
              RootValuesActions.savingsUpdated({
                newSavingsValue: action.newSavingsValue,
              }),
              ActivityLogActions.recordAdded({ record: action.activityLogRecord })
            );
          }),
          catchError((error) => {
            this.snackbarHandler.showErrorSnackbar(error);

            return of(RootValuesActions.savingsUpdateFail());
          })
        )
      )
    )
  );

  updateFreeMoney$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RootValuesActions.updateFreeMoney),
      mergeMap((action) =>
        from(this.rootValuesService.updateFreeMoney(action.newFreeMoneyValue, action.activityLogRecord)).pipe(
          switchMap(() => {
            this.snackbarHandler.showFreeMoneyEditedSnackbar();

            return of(
              RootValuesActions.freeMoneyUpdated({
                newFreeMoneyValue: action.newFreeMoneyValue,
              }),
              ActivityLogActions.recordAdded({ record: action.activityLogRecord })
            );
          }),
          catchError((error) => {
            this.snackbarHandler.showErrorSnackbar(error);

            return of(RootValuesActions.freeMoneyUpdateFail());
          })
        )
      )
    )
  );

  resetValueUpdatingProp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        RootValuesActions.balanceUpdated,
        RootValuesActions.balanceUpdateFail,
        RootValuesActions.savingsUpdated,
        RootValuesActions.savingsUpdateFail,
        RootValuesActions.freeMoneyUpdated,
        RootValuesActions.freeMoneyUpdateFail
      ),
      delay(1000),
      map(() => RootValuesActions.resetValueUpdatingProp())
    )
  );
}
