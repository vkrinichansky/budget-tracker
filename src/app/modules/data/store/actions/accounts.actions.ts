import { createAction, props } from '@ngrx/store';
import { Account } from '../../models';

export const AccountsActions = {
  accountsLoaded: createAction('[Accounts] Accounts loaded', props<{ accounts: Account[] }>()),
  clean: createAction('[Accounts] Clean state'),
};
