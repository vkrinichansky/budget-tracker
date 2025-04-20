import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, mergeMap, of, switchMap } from 'rxjs';
import { AccountsActions, ActivityLogActions } from '../actions';
import { AccountsApiService } from '../../services';
import { Account } from '@budget-tracker/models';

@Injectable()
export class AccountsEffects {
  constructor(
    private actions$: Actions,
    private accountService: AccountsApiService
  ) {}

  addAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.addAccount),
      mergeMap((action) =>
        from(this.accountService.addAccount(action.account, action.updatedAccountsOrder)).pipe(
          switchMap(() => {
            return of(
              AccountsActions.accountAdded({
                account: action.account,
                updatedAccountsOrder: action.updatedAccountsOrder,
              })
            );
          }),
          catchError(() => {
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
            return of(
              AccountsActions.accountRemoved({
                accountId: action.accountId,
                updatedAccountsOrder: action.updatedAccountsOrder,
              })
            );
          }),
          catchError(() => {
            return of(AccountsActions.removeAccountFail({ accountId: action.accountId }));
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
          catchError(() => {
            return of(AccountsActions.moveMoneyBetweenAccountsFail());
          })
        )
      )
    )
  );

  bulkAccountChangeOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.bulkAccountChangeOrder),
      mergeMap((action) =>
        from(this.accountService.bulkAccountChangeOrder(action.updatedAccountsOrder)).pipe(
          switchMap(() => {
            return of(
              AccountsActions.bulkAccountOrderChanged({
                updatedAccountsOrder: action.updatedAccountsOrder,
              })
            );
          }),
          catchError(() => {
            return of(AccountsActions.bulkAccountChangeOrderFail());
          })
        )
      )
    )
  );
}
