import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Account } from '../../models';
import { AccountsActions } from '../actions';

export interface AccountsState {
  accounts: EntityState<Account>;
  accountValueEdit: {
    success: boolean;
    error: boolean;
    inProgress: boolean;
  };
}

function selectAccountId(account: Account) {
  return account.id;
}

export const accountEntityAdapter = createEntityAdapter({
  selectId: selectAccountId,
});

const initialState: AccountsState = {
  accounts: accountEntityAdapter.getInitialState({}),
  accountValueEdit: {
    success: false,
    error: false,
    inProgress: false,
  },
};

const adapterReducer = createReducer(
  initialState,
  on(AccountsActions.accountsLoaded, (state, action) => ({
    ...state,
    accounts: accountEntityAdapter.addMany(action.accounts, state.accounts),
  })),

  on(AccountsActions.editAccountValue, (state) => ({
    ...state,
    accountValueEdit: {
      inProgress: true,
      error: false,
      success: false,
    },
  })),

  on(AccountsActions.accountValueEdited, (state, action) => ({
    ...state,
    accounts: accountEntityAdapter.updateOne(
      { id: action.updatedAccount.id, changes: action.updatedAccount },
      state.accounts
    ),
    accountValueEdit: {
      inProgress: false,
      error: false,
      success: true,
    },
  })),

  on(AccountsActions.editAccountValueFail, (state) => ({
    ...state,
    accountValueEdit: {
      inProgress: false,
      error: true,
      success: false,
    },
  })),

  on(AccountsActions.resetAccountValueEditProp, (state) => ({
    ...state,
    accountValueEdit: {
      inProgress: false,
      error: false,
      success: false,
    },
  })),

  on(AccountsActions.clean, () => initialState)
);

export function accountsReducer(state = initialState, action: Action): AccountsState {
  return adapterReducer(state, action);
}