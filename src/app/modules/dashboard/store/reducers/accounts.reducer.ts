import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Account } from '@budget-tracker/models';
import { AccountsActions } from '../actions';

export interface AccountsState {
  accounts: EntityState<Account>;
  accountValueEdit: {
    success: boolean;
    inProgress: boolean;
  };
  accountManagement: {
    inProgress: boolean;
    success: boolean;
  };
  removingAccountsIds: string[];
  orderChangingInProgress: boolean;
  movingMoneyBetweenAccountsInProgress: {
    inProgress: boolean;
    success: boolean;
  };
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
  accountValueEdit: {
    success: false,
    inProgress: false,
  },
  accountManagement: {
    success: false,
    inProgress: false,
  },
  removingAccountsIds: [],
  orderChangingInProgress: false,
  movingMoneyBetweenAccountsInProgress: {
    success: false,
    inProgress: false,
  },
  isLoaded: false,
};

const adapterReducer = createReducer(
  initialState,
  on(AccountsActions.accountsLoaded, (state, action) => ({
    ...state,
    accounts: accountEntityAdapter.addMany(action.accounts, state.accounts),
    isLoaded: true,
  })),

  on(AccountsActions.addAccount, (state) => ({
    ...state,
    accountManagement: {
      inProgress: true,
      success: false,
    },
  })),

  on(AccountsActions.accountAdded, (state, action) => {
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
      accountManagement: {
        inProgress: false,
        success: true,
      },
    };
  }),

  on(AccountsActions.addAccountFail, (state) => ({
    ...state,
    accountManagement: {
      inProgress: false,
      success: false,
    },
  })),

  on(AccountsActions.removeAccount, (state, action) => ({
    ...state,
    accountManagement: {
      inProgress: true,
      success: false,
    },
    removingAccountsIds: [...state.removingAccountsIds, action.accountId],
  })),

  on(AccountsActions.accountRemoved, (state, action) => {
    const updatedState = {
      ...state,
      accounts: accountEntityAdapter.removeOne(action.accountId, state.accounts),
      categoryManagement: {
        inProgress: false,
        success: true,
      },
      removingAccountsIds: state.removingAccountsIds.filter((id) => id !== action.accountId),
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

  on(AccountsActions.removeAccountFail, (state, action) => ({
    ...state,
    categoryManagement: {
      inProgress: false,
      success: false,
    },
    removingCategoriesIds: state.removingAccountsIds.filter((id) => id !== action.accountId),
  })),

  on(AccountsActions.resetAccountManagementProp, (state) => ({
    ...state,
    accountManagement: {
      inProgress: false,
      success: false,
    },
  })),

  on(AccountsActions.editAccountValue, (state) => ({
    ...state,
    accountValueEdit: {
      inProgress: true,
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
      success: true,
    },
  })),

  on(AccountsActions.editAccountValueFail, (state) => ({
    ...state,
    accountValueEdit: {
      inProgress: false,
      success: false,
    },
  })),

  on(AccountsActions.resetAccountValueEditProp, (state) => ({
    ...state,
    accountValueEdit: {
      inProgress: false,
      success: false,
    },
  })),

  on(AccountsActions.moveMoneyBetweenAccounts, (state) => ({
    ...state,
    movingMoneyBetweenAccountsInProgress: {
      inProgress: true,
      success: false,
    },
  })),

  on(AccountsActions.moneyBetweenAccountsMoved, (state, action) => ({
    ...state,
    accounts: accountEntityAdapter.updateMany(
      action.updatedAccounts.map((account) => ({
        changes: { value: account.value },
        id: account.id,
      })),
      state.accounts
    ),
    movingMoneyBetweenAccountsInProgress: {
      inProgress: false,
      success: true,
    },
  })),

  on(AccountsActions.moveMoneyBetweenAccountsFail, (state) => ({
    ...state,
    movingMoneyBetweenAccountsInProgress: {
      inProgress: false,
      success: false,
    },
  })),

  on(AccountsActions.resetMovingMoneyBetweenAccountsProp, (state) => ({
    ...state,
    movingMoneyBetweenAccountsInProgress: {
      inProgress: false,
      success: false,
    },
  })),

  on(AccountsActions.setOrderChangingInProgressToTrue, (state) => ({
    ...state,
    orderChangingInProgress: true,
  })),

  on(AccountsActions.bulkAccountOrderChanged, (state, action) => ({
    ...state,
    accounts: accountEntityAdapter.updateMany(
      Object.entries(action.updatedAccountsOrder).map((entry) => ({
        changes: { order: entry[1] },
        id: entry[0],
      })),
      state.accounts
    ),
    orderChangingInProgress: false,
  })),

  on(AccountsActions.bulkAccountChangeOrderFail, (state) => ({
    ...state,
    orderChangingInProgress: false,
  })),

  on(AccountsActions.cleanState, () => initialState)
);

export function accountsReducer(state = initialState, action: Action): AccountsState {
  return adapterReducer(state, action);
}
