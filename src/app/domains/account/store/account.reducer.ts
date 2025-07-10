import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Account } from '../models';
import { AccountActions } from './account.actions';

export interface AccountState {
  accounts: EntityState<Account>;
  isLoaded: boolean;
}

function selectAccountId(account: Account) {
  return account.id;
}

export const accountEntityAdapter = createEntityAdapter({
  selectId: selectAccountId,
});

const initialState: AccountState = {
  accounts: accountEntityAdapter.getInitialState({}),
  isLoaded: false,
};

const adapterReducer = createReducer(
  initialState,
  on(
    AccountActions.accountsLoaded,
    (state, action): AccountState => ({
      ...state,
      accounts: accountEntityAdapter.addMany(action.accounts, state.accounts),
      isLoaded: true,
    })
  ),

  on(AccountActions.accountAdded, (state, action): AccountState => {
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

  on(AccountActions.accountRemoved, (state, action): AccountState => {
    const updatedState: AccountState = {
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
    AccountActions.accountValueEdited,
    (state, action): AccountState => ({
      ...state,
      accounts: accountEntityAdapter.updateOne(
        { id: action.updatedAccount.id, changes: action.updatedAccount },
        state.accounts
      ),
    })
  ),

  on(
    AccountActions.moneyBetweenAccountsMoved,
    (state, action): AccountState => ({
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
    AccountActions.bulkAccountOrderChanged,
    (state, action): AccountState => ({
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

  on(AccountActions.cleanState, (): AccountState => initialState)
);

export function accountReducer(state = initialState, action: Action): AccountState {
  return adapterReducer(state, action);
}
