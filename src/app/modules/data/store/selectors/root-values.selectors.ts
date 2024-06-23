import { createSelector } from '@ngrx/store';
import { dataFeatureSelector } from './feature.selector';

const RootValuesStateSelector = createSelector(
  dataFeatureSelector,
  (dataFeatureState) => dataFeatureState.rootValuesState
);

const fullBalanceSelector = createSelector(RootValuesStateSelector, (state) => state.balance);

const freeMoneySelector = createSelector(RootValuesStateSelector, (state) => state.freeMoney);

const savingsSelector = createSelector(RootValuesStateSelector, (state) => state.savings);

const currentBalanceSelector = createSelector(
  fullBalanceSelector,
  freeMoneySelector,
  savingsSelector,
  (balance, freeMoney, savings) => balance - freeMoney - savings
);

const valueUpdatingInProgressSelector = createSelector(
  RootValuesStateSelector,
  (state) => state.rootValueUpdating.inProgress
);

const valueUpdatingSuccessSelector = createSelector(
  RootValuesStateSelector,
  (state) => state.rootValueUpdating.success
);

const valueUpdatingErrorSelector = createSelector(RootValuesStateSelector, (state) => state.rootValueUpdating.error);

export const RootValuesSelectors = {
  RootValuesStateSelector,
  fullBalanceSelector,
  freeMoneySelector,
  savingsSelector,
  currentBalanceSelector,
  valueUpdatingInProgressSelector,
  valueUpdatingSuccessSelector,
  valueUpdatingErrorSelector,
};
