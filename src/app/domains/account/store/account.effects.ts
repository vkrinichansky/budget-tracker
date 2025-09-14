import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, EMPTY, from, map, mergeMap, of, switchMap, tap, timeout } from 'rxjs';
import { AccountActions } from './account.actions';
import { Account, AccountEvents } from '../models';
import { AccountApiService } from '../services';
import { AuthActions } from '@budget-tracker/auth';
import { EventBusService } from '@budget-tracker/utils';
import { Store } from '@ngrx/store';

const REQUEST_TIMEOUT = 5000;

@Injectable()
export class AccountEffects {
  constructor(
    private actions$: Actions,
    private accountService: AccountApiService,
    private eventBus: EventBusService,
    private store: Store
  ) {}

  loadAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.loadAccounts),
      switchMap(() =>
        from(this.accountService.loadAccounts()).pipe(
          timeout(REQUEST_TIMEOUT),
          map((accounts) => AccountActions.accountsLoaded({ accounts: Object.values(accounts) }))
        )
      )
    )
  );

  addAccount$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AccountActions.addAccount),
        mergeMap((action) =>
          from(this.accountService.addAccount(action.account, action.updatedAccountsOrder)).pipe(
            timeout(REQUEST_TIMEOUT),
            tap(() => {
              this.store.dispatch(
                AccountActions.accountAdded({
                  account: action.account,
                  updatedAccountsOrder: action.updatedAccountsOrder,
                })
              );

              this.eventBus.emit({
                type: AccountEvents.ADD_ACCOUNT,
                status: 'success',
              });
            }),
            catchError(() => {
              this.eventBus.emit({
                type: AccountEvents.ADD_ACCOUNT,
                status: 'error',
                errorCode: 'errors.account.addAccountFailed',
              });

              return EMPTY;
            })
          )
        )
      ),
    { dispatch: false }
  );

  removeAccount$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AccountActions.removeAccount),
        mergeMap((action) =>
          from(
            this.accountService.removeAccount(action.accountId, action.updatedAccountsOrder)
          ).pipe(
            timeout(REQUEST_TIMEOUT),
            tap(() => {
              this.store.dispatch(
                AccountActions.accountRemoved({
                  accountId: action.accountId,
                  updatedAccountsOrder: action.updatedAccountsOrder,
                })
              );

              this.eventBus.emit({
                type: AccountEvents.REMOVE_ACCOUNT,
                status: 'success',
                operationId: action.accountId,
              });
            }),
            catchError(() => {
              this.eventBus.emit({
                type: AccountEvents.REMOVE_ACCOUNT,
                status: 'error',
                errorCode: 'errors.account.removeAccountFailed',
                operationId: action.accountId,
              });

              return EMPTY;
            })
          )
        )
      ),
    { dispatch: false }
  );

  bulkAccountChangeOrder$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AccountActions.bulkAccountChangeOrder),
        mergeMap((action) =>
          from(this.accountService.bulkAccountChangeOrder(action.updatedAccountsOrder)).pipe(
            timeout(REQUEST_TIMEOUT),
            tap(() => {
              this.eventBus.emit({
                type: AccountEvents.CHANGE_ACCOUNTS_ORDER,
                status: 'success',
              });

              this.store.dispatch(
                AccountActions.bulkAccountOrderChanged({
                  updatedAccountsOrder: action.updatedAccountsOrder,
                })
              );
            }),
            catchError(() => {
              this.eventBus.emit({
                type: AccountEvents.CHANGE_ACCOUNTS_ORDER,
                status: 'error',
                errorCode: 'errors.account.changeAccountsOrderFailed',
              });

              return EMPTY;
            })
          )
        )
      ),
    { dispatch: false }
  );

  cleanStateOnLogOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() => of(AccountActions.cleanState()))
    )
  );
}
