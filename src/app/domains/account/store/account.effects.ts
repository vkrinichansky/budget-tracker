import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, map, mergeMap, of, switchMap } from 'rxjs';
import { AccountsActions } from './account.actions';
import { Account } from '../models';
import { AccountApiService } from '../services';
import { AuthActions } from '@budget-tracker/auth';

@Injectable()
export class AccountEffects {
  constructor(
    private actions$: Actions,
    private accountService: AccountApiService
  ) {}

  loadAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.loadAccounts),
      switchMap(() => from(this.accountService.loadAccounts())),
      map((accounts) => AccountsActions.accountsLoaded({ accounts: Object.values(accounts) }))
    )
  );

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
            action.toAccountNewValue
          )
        ).pipe(
          switchMap(() => {
            return of(
              AccountsActions.moneyBetweenAccountsMoved({
                updatedAccounts: [
                  { id: action.fromAccountId, value: action.fromAccountNewValue } as Account,
                  { id: action.toAccountId, value: action.toAccountNewValue } as Account,
                ],
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

  cleanStateOnLogOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() => of(AccountsActions.cleanState()))
    )
  );
}
