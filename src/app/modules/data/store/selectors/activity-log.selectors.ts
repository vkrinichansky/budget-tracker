import { createSelector } from '@ngrx/store';
import { dataFeatureSelector } from './feature.selector';
import { ActivityLogRecordType, CategoryValueChangeRecord } from '../../models';

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

const isBulkRecordsRemovingInProgressSelector = createSelector(
  activityLogStateSelector,
  (state) => state.bulkRecordsRemove
);

const relatedCategoryValueChangeRecordsByCategoryIdSelector = (categoryId: string) =>
  createSelector(activityLogSelector, (activityLog) =>
    activityLog
      .filter((record) => record.recordType === ActivityLogRecordType.CategoryValueChange)
      .map((record) => record as CategoryValueChangeRecord)
      .filter((record) => record.categoryId === categoryId)
  );

export const ActivityLogSelectors = {
  activityLogStateSelector,
  activityLogSelector,
  removingRecordsIdsSelector,
  selectRecordByIdSelector,
  activityLogDictionarySelector,
  isBulkRecordsRemovingInProgressSelector,
  relatedCategoryValueChangeRecordsByCategoryIdSelector,
};
