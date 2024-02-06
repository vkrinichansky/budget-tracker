import { createSelector } from '@ngrx/store';
import { dataFeatureSelector } from './feature.selector';

const activityLogStateSelector = createSelector(
  dataFeatureSelector,
  (dataFeatureState) => dataFeatureState.activityLogState
);

const activityLogSelector = createSelector(activityLogStateSelector, (state) => state.activityLog);

export const ActivityLogSelectors = {
  activityLogStateSelector,
  activityLogSelector,
};
