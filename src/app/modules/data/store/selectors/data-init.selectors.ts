import { createSelector } from '@ngrx/store';
import { dataFeatureSelector } from './feature.selector';

const dataInitStateSelector = createSelector(
  dataFeatureSelector,
  (dataFeatureState) => dataFeatureState.dataInitState
);

const dataLoadedSelector = createSelector(dataInitStateSelector, (state) => state.isDataLoaded);

export const DataInitSelectors = {
  dataInitStateSelector,
  dataLoadedSelector,
};
