import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Account } from '../../models';
import { AccountsActions } from '../actions';

export interface AccountsState {
  accounts: EntityState<Account>;
}

function selectAccountId(account: Account) {
  return account.id;
}

export const accountEntityAdapter = createEntityAdapter({
  selectId: selectAccountId,
});

const initialState: AccountsState = {
  accounts: accountEntityAdapter.getInitialState({}),
};

const adapterReducer = createReducer(
  initialState,
  on(AccountsActions.accountsLoaded, (state, action) => ({
    ...state,
    accounts: accountEntityAdapter.addMany(action.accounts, state.accounts),
  })),

  on(AccountsActions.clean, () => initialState)
);

export function accountsReducer(state = initialState, action: Action): AccountsState {
  return adapterReducer(state, action);
}
