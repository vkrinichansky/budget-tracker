import { createAction, props } from '@ngrx/store';
import { Account, AccountValueEditRecord } from '../../models';

export const AccountsActions = {
  accountsLoaded: createAction('[Accounts] Accounts loaded', props<{ accounts: Account[] }>()),

  editAccountValue: createAction(
    '[Accounts] Edit account value',
    props<{ accountId: string; newValue: number; activityLogRecord: AccountValueEditRecord }>()
  ),

  accountValueEdited: createAction('[Accounts] Account value edited', props<{ updatedAccount: Account }>()),

  editAccountValueFail: createAction('[Accounts] Edit account value fail'),

  resetAccountValueEditProp: createAction('[Accounts] Reset account value edit prop'),

  clean: createAction('[Accounts] Clean state'),
};
