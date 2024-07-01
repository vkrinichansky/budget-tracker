import { createSelector } from '@ngrx/store';
import { dataFeatureSelector } from './feature.selector';

const dataInitStateSelector = createSelector(dataFeatureSelector, (dataFeatureState) => dataFeatureState.dataInitState);

const dataLoadingSelector = createSelector(dataInitStateSelector, (state) => state.isDataLoading);

export const DataInitSelectors = {
  budgetTrackerStateSelector: dataInitStateSelector,
  dataLoadingSelector,
};
