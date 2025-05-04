import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Account } from '@budget-tracker/models';
import { AccountsActions } from '../actions';

export interface AccountsState {
  accounts: EntityState<Account>;
  isLoaded: boolean;
}

function selectAccountId(account: Account) {
  return account.id;
}

export const accountEntityAdapter = createEntityAdapter({
  selectId: selectAccountId,
});

const initialState: AccountsState = {
  accounts: accountEntityAdapter.getInitialState({}),
  isLoaded: false,
};

const adapterReducer = createReducer(
  initialState,
  on(
    AccountsActions.accountsLoaded,
    (state, action): AccountsState => ({
      ...state,
      accounts: accountEntityAdapter.addMany(action.accounts, state.accounts),
      isLoaded: true,
    })
  ),

  on(AccountsActions.accountAdded, (state, action): AccountsState => {
    const updatedAccounts: Account[] = [
      action.account,
      ...Object.keys(action.updatedAccountsOrder).map(
        (key) =>
          ({
            id: key,
            order: action.updatedAccountsOrder[key],
          }) as Account
      ),
    ];

    return {
      ...state,
      accounts: accountEntityAdapter.upsertMany(updatedAccounts, state.accounts),
    };
  }),

  on(AccountsActions.accountRemoved, (state, action): AccountsState => {
    const updatedState: AccountsState = {
      ...state,
      accounts: accountEntityAdapter.removeOne(action.accountId, state.accounts),
    };

    return {
      ...updatedState,
      accounts: accountEntityAdapter.updateMany(
        Object.entries(action.updatedAccountsOrder).map((entry) => ({
          changes: { order: entry[1] },
          id: entry[0],
        })),
        updatedState.accounts
      ),
    };
  }),

  on(
    AccountsActions.accountValueEdited,
    (state, action): AccountsState => ({
      ...state,
      accounts: accountEntityAdapter.updateOne(
        { id: action.updatedAccount.id, changes: action.updatedAccount },
        state.accounts
      ),
    })
  ),

  on(
    AccountsActions.moneyBetweenAccountsMoved,
    (state, action): AccountsState => ({
      ...state,
      accounts: accountEntityAdapter.updateMany(
        action.updatedAccounts.map((account) => ({
          changes: { value: account.value },
          id: account.id,
        })),
        state.accounts
      ),
    })
  ),

  on(
    AccountsActions.bulkAccountOrderChanged,
    (state, action): AccountsState => ({
      ...state,
      accounts: accountEntityAdapter.updateMany(
        Object.entries(action.updatedAccountsOrder).map((entry) => ({
          changes: { order: entry[1] },
          id: entry[0],
        })),
        state.accounts
      ),
    })
  ),

  on(AccountsActions.cleanState, (): AccountsState => initialState)
);

export function accountsReducer(state = initialState, action: Action): AccountsState {
  return adapterReducer(state, action);
}
