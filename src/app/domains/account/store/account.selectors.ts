import { createSelector } from '@ngrx/store';
import { dataFeatureSelector } from './feature-selector';
import { CurrencyExchangeRate, CurrenciesEnum } from '@budget-tracker/metadata';

const allAccountsDictionarySelector = createSelector(
  dataFeatureSelector,
  (state) => state.accounts.entities
);

const accountsLoadedSelector = createSelector(dataFeatureSelector, (state) => state.isLoaded);

const allAccountsSelector = createSelector(allAccountsDictionarySelector, (accountsDictionary) =>
  Object.values(accountsDictionary).sort((a, b) => a.order - b.order)
);

const accountByIdSelector = (accountId: string) =>
  createSelector(
    allAccountsDictionarySelector,
    (accountsDictionary) => accountsDictionary[accountId]
  );

const fullBalanceSelector = (
  currency: CurrenciesEnum,
  currencyExchangeRate: CurrencyExchangeRate
) =>
  createSelector(allAccountsSelector, (allAccounts) =>
    allAccounts.reduce(
      (fullBalance, account) =>
        account.currency === currency
          ? fullBalance + account.value
          : fullBalance + Math.round(account.value / currencyExchangeRate[account.currency]),
      0
    )
  );

export const AccountSelectors = {
  allAccountsSelector,
  accountByIdSelector,
  fullBalanceSelector,
  accountsLoadedSelector,
};
