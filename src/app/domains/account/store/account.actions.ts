import { createAction, props } from '@ngrx/store';
import { Account } from '../models';

export const AccountActions = {
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

  accountsUpdated: createAction(
    '[Accounts] Accounts updated',
    props<{ updatedAccounts: Account[] }>()
  ),
};
