import { createSelector } from '@ngrx/store';
import { dataFeatureSelector } from './feature.selector';
import { CurrenciesEnum, CurrencyExchangeRate } from '../../models';

const accountsStateSelector = createSelector(dataFeatureSelector, (dataFeatureState) => dataFeatureState.accountsState);

const allAccountsDictionarySelector = createSelector(accountsStateSelector, (state) => state.accounts.entities);

const allAccountsSelector = createSelector(allAccountsDictionarySelector, (accountsDictionary) =>
  Object.values(accountsDictionary).sort((a, b) => a.order - b.order)
);

const accountByIdSelector = (accountId: string) =>
  createSelector(allAccountsDictionarySelector, (accountsDictionary) => accountsDictionary[accountId]);

const editAccountValueInProgressSelector = createSelector(
  accountsStateSelector,
  (state) => state.accountValueEdit.inProgress
);

const editAccountValueSucceedSelector = createSelector(
  accountsStateSelector,
  (state) => state.accountValueEdit.success
);

const accountManagementInProgressSelector = createSelector(
  accountsStateSelector,
  (state) => state.accountManagement.inProgress
);

const accountManagementSuccessSelector = createSelector(
  accountsStateSelector,
  (state) => state.accountManagement.success
);

const isAccountRemovingSelector = (accountId: string) =>
  createSelector(accountsStateSelector, (state) => state.removingAccountsIds.includes(accountId));

const fullBalanceSelector = (currency: CurrenciesEnum, currencyExchangeRate: CurrencyExchangeRate) =>
  createSelector(allAccountsSelector, (allAccounts) =>
    allAccounts.reduce(
      (fullBalance, account) =>
        account.currency.id === currency
          ? fullBalance + account.value
          : fullBalance + Math.round(account.value / currencyExchangeRate[account.currency.id]),
      0
    )
  );

const orderChangingInProgressSelector = createSelector(accountsStateSelector, (state) => state.orderChangingInProgress);

export const AccountsSelectors = {
  accountsStateSelector,
  allAccountsSelector,
  accountByIdSelector,
  editAccountValueInProgressSelector,
  editAccountValueSucceedSelector,
  accountManagementInProgressSelector,
  accountManagementSuccessSelector,
  isAccountRemovingSelector,
  fullBalanceSelector,
  orderChangingInProgressSelector,
};
