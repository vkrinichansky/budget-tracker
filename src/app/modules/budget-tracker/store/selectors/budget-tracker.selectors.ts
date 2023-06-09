import { createSelector } from '@ngrx/store';
import { budgetTrackerFeature } from '../reducers';

const budgetTrackerStateSelector = createSelector(
  budgetTrackerFeature.selectBudgetTrackerState,
  (budgetTrackerState) => budgetTrackerState
);

const dataLoadingSelector = createSelector(budgetTrackerFeature.selectIsDataLoading, (isLoading) => isLoading);

export const BudgetTrackerSelectors = {
  budgetTrackerStateSelector,
  dataLoadingSelector,
};
