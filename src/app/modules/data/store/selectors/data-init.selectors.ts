import { createSelector } from '@ngrx/store';
import { dataFeatureSelector } from './feature.selector';

const budgetTrackerStateSelector = createSelector(
  dataFeatureSelector,
  (dataFeatureState) => dataFeatureState.dataInitState
);

const dataLoadingSelector = createSelector(budgetTrackerStateSelector, (state) => state.isDataLoading);

export const DataInitSelectors = {
  budgetTrackerStateSelector,
  dataLoadingSelector,
};
