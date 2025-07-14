import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, EMPTY, from, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { AccountActions } from './account.actions';
import { Account, AccountEvents } from '../models';
import { AccountApiService } from '../services';
import { AuthActions } from '@budget-tracker/auth';
import { EventBusService } from '@budget-tracker/utils';

@Injectable()
export class AccountEffects {
  constructor(
    private actions$: Actions,
    private accountService: AccountApiService,
    private eventBus: EventBusService
  ) {}

  loadAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.loadAccounts),
      switchMap(() => from(this.accountService.loadAccounts())),
      map((accounts) => AccountActions.accountsLoaded({ accounts: Object.values(accounts) }))
    )
  );

  addAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.addAccount),
      mergeMap((action) =>
        from(this.accountService.addAccount(action.account, action.updatedAccountsOrder)).pipe(
          switchMap(() => {
            return of(
              AccountActions.accountAdded({
                account: action.account,
                updatedAccountsOrder: action.updatedAccountsOrder,
              })
            );
          }),
          catchError(() => {
            return of(AccountActions.addAccountFail());
          })
        )
      )
    )
  );

  removeAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.removeAccount),
      mergeMap((action) =>
        from(this.accountService.removeAccount(action.accountId, action.updatedAccountsOrder)).pipe(
          switchMap(() => {
            return of(
              AccountActions.accountRemoved({
                accountId: action.accountId,
                updatedAccountsOrder: action.updatedAccountsOrder,
              })
            );
          }),
          catchError(() => {
            return of(AccountActions.removeAccountFail({ accountId: action.accountId }));
          })
        )
      )
    )
  );

  moveMoneyBetweenAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.moveMoneyBetweenAccounts),
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
              AccountActions.moneyBetweenAccountsMoved({
                updatedAccounts: [
                  { id: action.fromAccountId, value: action.fromAccountNewValue } as Account,
                  { id: action.toAccountId, value: action.toAccountNewValue } as Account,
                ],
              })
            );
          }),
          catchError(() => {
            return of(AccountActions.moveMoneyBetweenAccountsFail());
          })
        )
      )
    )
  );

  bulkAccountChangeOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.bulkAccountChangeOrder),
      mergeMap((action) =>
        from(this.accountService.bulkAccountChangeOrder(action.updatedAccountsOrder)).pipe(
          switchMap(() => {
            return of(
              AccountActions.bulkAccountOrderChanged({
                updatedAccountsOrder: action.updatedAccountsOrder,
              })
            );
          }),
          catchError(() => {
            return of(AccountActions.bulkAccountChangeOrderFail());
          })
        )
      )
    )
  );

  cleanStateOnLogOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() => of(AccountActions.cleanState()))
    )
  );
}
