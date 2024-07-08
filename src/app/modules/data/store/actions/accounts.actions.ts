import { createAction, props } from '@ngrx/store';
import { Account, AccountManagementRecord, AccountValueEditRecord } from '../../models';

export const AccountsActions = {
  accountsLoaded: createAction('[Accounts] Accounts loaded', props<{ accounts: Account[] }>()),

  addAccount: createAction(
    '[Accounts] Add account',
    props<{ account: Account; activityLogRecord: AccountManagementRecord }>()
  ),

  accountAdded: createAction('[Accounts] Account added', props<{ account: Account }>()),

  addAccountFail: createAction('[Accounts] Add account fail'),

  removeAccount: createAction(
    '[Accounts] Remove account',
    props<{
      accountId: string;
      activityLogRecord: AccountManagementRecord;
    }>()
  ),

  accountRemoved: createAction('[Accounts] Account removed', props<{ accountId: string }>()),

  removeAccountFail: createAction('[Accounts] Remove account fail', props<{ accountId: string }>()),

  resetAccountManagementProp: createAction('[Accounts] Reset account management prop'),

  editAccountValue: createAction(
    '[Accounts] Edit account value',
    props<{ accountId: string; newValue: number; activityLogRecord: AccountValueEditRecord }>()
  ),

  accountValueEdited: createAction('[Accounts] Account value edited', props<{ updatedAccount: Account }>()),

  editAccountValueFail: createAction('[Accounts] Edit account value fail'),

  resetAccountValueEditProp: createAction('[Accounts] Reset account value edit prop'),

  clean: createAction('[Accounts] Clean state'),
};
