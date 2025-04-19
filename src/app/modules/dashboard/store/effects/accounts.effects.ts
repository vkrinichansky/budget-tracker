import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, debounceTime, delay, from, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { AccountsActions, ActivityLogActions } from '../actions';
import { AccountsApiService } from '../../services';
import { Account } from '@budget-tracker/models';
import { Store } from '@ngrx/store';
import { SnackbarHandlerService } from '@budget-tracker/design-system';

@Injectable()
export class AccountsEffects {
  constructor(
    private actions$: Actions,
    private snackbarHandler: SnackbarHandlerService,
    private accountService: AccountsApiService,
    private store: Store
  ) {}

  addAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.addAccount),
      mergeMap((action) =>
        from(this.accountService.addAccount(action.account, action.updatedAccountsOrder)).pipe(
          switchMap(() => {
            this.snackbarHandler.showAccountAddedSnackbar();

            return of(
              AccountsActions.accountAdded({
                account: action.account,
                updatedAccountsOrder: action.updatedAccountsOrder,
              })
            );
          }),
          catchError((error) => {
            this.snackbarHandler.showErrorSnackbar(error);

            return of(AccountsActions.addAccountFail());
          })
        )
      )
    )
  );

  removeAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.removeAccount),
      mergeMap((action) =>
        from(this.accountService.removeAccount(action.accountId, action.updatedAccountsOrder)).pipe(
          switchMap(() => {
            this.snackbarHandler.showAccountRemovedSnackbar();

            return of(
              AccountsActions.accountRemoved({
                accountId: action.accountId,
                updatedAccountsOrder: action.updatedAccountsOrder,
              })
            );
          }),
          catchError((error) => {
            this.snackbarHandler.showErrorSnackbar(error);

            return of(AccountsActions.removeAccountFail({ accountId: action.accountId }));
          })
        )
      )
    )
  );

  editAccountValue$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.editAccountValue),
      mergeMap((action) =>
        from(
          this.accountService.editAccountValue(
            action.accountId,
            action.newValue,
            action.activityLogRecord
          )
        ).pipe(
          switchMap(() => {
            this.snackbarHandler.showAccountValueEditedSnackbar();

            return of(
              AccountsActions.accountValueEdited({
                updatedAccount: { id: action.accountId, value: action.newValue } as Account,
              }),
              ActivityLogActions.recordAdded({
                record: action.activityLogRecord,
              })
            );
          }),
          catchError((error) => {
            this.snackbarHandler.showErrorSnackbar(error);

            return of(AccountsActions.editAccountValueFail());
          })
        )
      )
    )
  );

  moveMoneyBetweenAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.moveMoneyBetweenAccounts),
      mergeMap((action) =>
        from(
          this.accountService.moveMoneyBetweenAccounts(
            action.fromAccountId,
            action.toAccountId,
            action.fromAccountNewValue,
            action.toAccountNewValue,
            action.activityLogRecord
          )
        ).pipe(
          switchMap(() => {
            this.snackbarHandler.showMoneyBetweenAccountsMovedSnackbar();

            return of(
              AccountsActions.moneyBetweenAccountsMoved({
                updatedAccounts: [
                  { id: action.fromAccountId, value: action.fromAccountNewValue } as Account,
                  { id: action.toAccountId, value: action.toAccountNewValue } as Account,
                ],
              }),
              ActivityLogActions.recordAdded({
                record: action.activityLogRecord,
              })
            );
          }),
          catchError((error) => {
            this.snackbarHandler.showErrorSnackbar(error);

            return of(AccountsActions.moveMoneyBetweenAccountsFail());
          })
        )
      )
    )
  );

  bulkAccountChangeOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.bulkAccountChangeOrder),
      debounceTime(2000),
      tap(() => this.store.dispatch(AccountsActions.setOrderChangingInProgressToTrue())),
      mergeMap((action) =>
        from(this.accountService.bulkAccountChangeOrder(action.updatedAccountsOrder)).pipe(
          switchMap(() => {
            this.snackbarHandler.showAccountOrderChangedSnackbar();

            return of(
              AccountsActions.bulkAccountOrderChanged({
                updatedAccountsOrder: action.updatedAccountsOrder,
              })
            );
          }),
          catchError((error) => {
            this.snackbarHandler.showErrorSnackbar(error);

            return of(AccountsActions.bulkAccountChangeOrderFail());
          })
        )
      )
    )
  );

  resetCategoryManagementProp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.accountAdded, AccountsActions.accountRemoved),
      delay(1000),
      map(() => AccountsActions.resetAccountManagementProp())
    )
  );

  resetAccountValueEditProp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.accountValueEdited),
      delay(1000),
      map(() => AccountsActions.resetAccountValueEditProp())
    )
  );

  resetMovingMoneyBetweenAccountsProp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.moneyBetweenAccountsMoved),
      delay(1000),
      map(() => AccountsActions.resetMovingMoneyBetweenAccountsProp())
    )
  );
}
