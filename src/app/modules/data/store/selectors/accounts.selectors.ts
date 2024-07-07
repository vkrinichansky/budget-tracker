import { createSelector } from '@ngrx/store';
import { dataFeatureSelector } from './feature.selector';

const accountsStateSelector = createSelector(dataFeatureSelector, (dataFeatureState) => dataFeatureState.accountsState);

const allAccountsDictionarySelector = createSelector(accountsStateSelector, (state) => state.accounts.entities);

const allAccountsSelector = createSelector(allAccountsDictionarySelector, (accountsDictionary) =>
  Object.values(accountsDictionary)
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

export const AccountsSelectors = {
  accountsStateSelector,
  allAccountsSelector,
  accountByIdSelector,
  editAccountValueInProgressSelector,
  editAccountValueSucceedSelector,
  accountManagementInProgressSelector,
  accountManagementSuccessSelector,
};
