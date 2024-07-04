import { createSelector } from '@ngrx/store';
import { dataFeatureSelector } from './feature.selector';

const accountsStateSelector = createSelector(dataFeatureSelector, (dataFeatureState) => dataFeatureState.accountsState);

const allAccountsDictionarySelector = createSelector(accountsStateSelector, (state) => state.accounts.entities);

const allAccountsSelector = createSelector(allAccountsDictionarySelector, (accountsDictionary) =>
  Object.values(accountsDictionary)
);

export const AccountsSelectors = {
  accountsStateSelector,
  allAccountsSelector,
};
