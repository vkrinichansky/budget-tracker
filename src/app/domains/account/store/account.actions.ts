import { createAction, props } from '@ngrx/store';
import { Account } from '../models';

export const AccountsActions = {
  loadAccounts: createAction('[Accounts] Load accounts'),
  accountsLoaded: createAction('[Accounts] Accounts loaded', props<{ accounts: Account[] }>()),
  cleanState: createAction('[Accounts] Clean state'),

  addAccount: createAction(
    '[Accounts] Add account',
    props<{
      account: Account;
      updatedAccountsOrder: Record<string, number>;
    }>()
  ),
  accountAdded: createAction(
    '[Accounts] Account added',
    props<{ account: Account; updatedAccountsOrder: Record<string, number> }>()
  ),
  addAccountFail: createAction('[Accounts] Add account fail'),

  removeAccount: createAction(
    '[Accounts] Remove account',
    props<{
      accountId: string;
      updatedAccountsOrder: Record<string, number>;
    }>()
  ),
  accountRemoved: createAction(
    '[Accounts] Account removed',
    props<{ accountId: string; updatedAccountsOrder: Record<string, number> }>()
  ),
  removeAccountFail: createAction('[Accounts] Remove account fail', props<{ accountId: string }>()),

  accountValueEdited: createAction(
    '[Accounts] Account value edited',
    props<{ updatedAccount: Account }>()
  ),

  bulkAccountChangeOrder: createAction(
    '[Accounts] Bulk account change order',
    props<{
      updatedAccountsOrder: Record<string, number>;
    }>()
  ),
  bulkAccountOrderChanged: createAction(
    '[Accounts] Bulk account order changed',
    props<{ updatedAccountsOrder: Record<string, number> }>()
  ),
  bulkAccountChangeOrderFail: createAction('[Accounts] Bulk account change order fail'),

  moveMoneyBetweenAccounts: createAction(
    '[Accounts] Move money between accounts',
    props<{
      fromAccountId: string;
      toAccountId: string;
      fromAccountNewValue: number;
      toAccountNewValue: number;
    }>()
  ),
  moneyBetweenAccountsMoved: createAction(
    '[Accounts] Money between accounts moved',
    props<{ updatedAccounts: Account[] }>()
  ),
  moveMoneyBetweenAccountsFail: createAction('[Accounts] Move money between accounts fail'),
};
