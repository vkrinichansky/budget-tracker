import { createAction, props } from '@ngrx/store';
import {
  Account,
  AccountValueEditRecord,
  MoveMoneyBetweenAccountsRecord,
} from '@budget-tracker/models';

export const AccountsActions = {
  accountsLoaded: createAction('[Accounts] Accounts loaded', props<{ accounts: Account[] }>()),
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
  resetAccountManagementProp: createAction('[Accounts] Reset account management prop'),
  editAccountValue: createAction(
    '[Accounts] Edit account value',
    props<{ accountId: string; newValue: number; activityLogRecord: AccountValueEditRecord }>()
  ),
  accountValueEdited: createAction(
    '[Accounts] Account value edited',
    props<{ updatedAccount: Account }>()
  ),
  editAccountValueFail: createAction('[Accounts] Edit account value fail'),
  resetAccountValueEditProp: createAction('[Accounts] Reset account value edit prop'),
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
  setOrderChangingInProgressToTrue: createAction('[Accounts] Set OrderChangingInProgress to true'),
  moveMoneyBetweenAccounts: createAction(
    '[Accounts] Move money between accounts',
    props<{
      fromAccountId: string;
      toAccountId: string;
      fromAccountNewValue: number;
      toAccountNewValue: number;
      activityLogRecord: MoveMoneyBetweenAccountsRecord;
    }>()
  ),
  moneyBetweenAccountsMoved: createAction(
    '[Accounts] Money between accounts moved',
    props<{ updatedAccounts: Account[] }>()
  ),
  moveMoneyBetweenAccountsFail: createAction('[Accounts] Move money between accounts fail'),
  resetMovingMoneyBetweenAccountsProp: createAction(
    '[Accounts] Reset moving money between accounts prop'
  ),
  cleanState: createAction('[Accounts] Clean state'),
};
