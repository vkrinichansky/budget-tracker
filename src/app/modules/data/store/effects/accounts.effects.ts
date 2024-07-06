import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, from, map, mergeMap, of, switchMap } from 'rxjs';
import { AccountsActions, ActivityLogActions } from '../actions';
import { AccountsService } from '../../services';
import { Account } from '../../models';
import { SnackbarHandlerService } from '@budget-tracker/utils';

@Injectable()
export class AccountsEffects {
  constructor(
    private actions$: Actions,
    private snackbarHandler: SnackbarHandlerService,
    private accountService: AccountsService
  ) {}

  editAccountValue$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.editAccountValue),
      mergeMap((action) =>
        from(this.accountService.editAccountValue(action.accountId, action.newValue, action.activityLogRecord)).pipe(
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

  resetAccountValueEditProp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.accountValueEdited, AccountsActions.editAccountValueFail),
      delay(1000),
      map(() => AccountsActions.resetAccountValueEditProp())
    )
  );
}
