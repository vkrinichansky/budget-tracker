import { createSelector } from '@ngrx/store';
import { activityLogFeature } from '../reducers';

const activityLogStateSelector = createSelector(
  activityLogFeature.selectActivityLogState,
  (activityLogState) => activityLogState
);

const activityLogSelector = createSelector(activityLogFeature.selectActivityLog, (activityLog) => activityLog);

export const ActivityLogSelectors = {
  budgetTrackerStateSelector: activityLogStateSelector,
  activityLogSelector,
};
