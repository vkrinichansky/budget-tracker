import { createSelector } from '@ngrx/store';
import { dataFeatureSelector } from './feature.selector';

const activityLogStateSelector = createSelector(
  dataFeatureSelector,
  (dataFeatureState) => dataFeatureState.activityLogState
);

const activityLogDictionarySelector = createSelector(
  activityLogStateSelector,
  (state) => state.activityLogRecords.entities
);

const activityLogSelector = createSelector(activityLogStateSelector, (state) =>
  Object.values(state.activityLogRecords.entities)
);

const removingRecordsIdsSelector = createSelector(activityLogStateSelector, (state) => state.removingRecordsIds);

const selectRecordByIdSelector = (recordId: string) =>
  createSelector(activityLogSelector, (activityLog) => activityLog.find((record) => record.id === recordId));

export const ActivityLogSelectors = {
  activityLogStateSelector,
  activityLogSelector,
  removingRecordsIdsSelector,
  selectRecordByIdSelector,
  activityLogDictionarySelector,
};
