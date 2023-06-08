import { createSelector } from '@ngrx/store';
import { rootValuesFeature } from '../reducers';

const RootValuesStateSelector = createSelector(
  rootValuesFeature.selectRootValuesState,
  (budgetTrackerState) => budgetTrackerState
);

const fullBalanceSelector = createSelector(rootValuesFeature.selectBalance, (balance) => balance);

const currentBalanceSelector = createSelector(
  rootValuesFeature.selectBalance,
  rootValuesFeature.selectFree,
  rootValuesFeature.selectSavings,
  (balance, free, savings) => balance - free - savings
);

const freeMoneySelector = createSelector(rootValuesFeature.selectFree, (freeMoney) => freeMoney);

const savingsSelector = createSelector(rootValuesFeature.selectSavings, (savings) => savings);

const valueUpdatingInProgressSelector = createSelector(
  rootValuesFeature.selectRootValueUpdating,
  (valueUpdating) => valueUpdating.inProgress
);

const valueUpdatingSuccessSelector = createSelector(
  rootValuesFeature.selectRootValueUpdating,
  (valueUpdating) => valueUpdating.success
);

const valueUpdatingErrorSelector = createSelector(
  rootValuesFeature.selectRootValueUpdating,
  (valueUpdating) => valueUpdating.error
);


export const RootValuesSelectors = {
  budgetTrackerStateSelector: RootValuesStateSelector,
  fullBalanceSelector,
  freeMoneySelector,
  savingsSelector,
  currentBalanceSelector,
  valueUpdatingInProgressSelector,
  valueUpdatingSuccessSelector,
  valueUpdatingErrorSelector,
};
