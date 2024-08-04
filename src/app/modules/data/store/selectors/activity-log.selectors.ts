import { createSelector } from '@ngrx/store';
import { dataFeatureSelector } from './feature.selector';
import {
  ActivityLog,
  ActivityLogGroupedByDay,
  ActivityLogGroupedByDayDictionary,
  ActivityLogRecordType,
  BudgetType,
  CategoryValueChangeRecord,
} from '../../models';
import { isPreviousMonth } from '@budget-tracker/utils';

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

const isActivityLogRecordRemovingSelector = (recordId: string) =>
  createSelector(activityLogStateSelector, (state) => state.removingRecordsIds.includes(recordId));

const selectRecordByIdSelector = (recordId: string) =>
  createSelector(activityLogSelector, (activityLog) =>
    activityLog.find((record) => record.id === recordId)
  );

const isBulkRecordsRemovingInProgressSelector = createSelector(
  activityLogStateSelector,
  (state) => state.bulkRecordsRemove
);

const relatedCategoryValueChangeRecordsByCategoryIdSelector = (categoryId: string) =>
  createSelector(activityLogSelector, (activityLog) =>
    activityLog
      .filter((record) => record.recordType === ActivityLogRecordType.CategoryValueChange)
      .map((record) => record as CategoryValueChangeRecord)
      .filter((record) => record.category.id === categoryId)
  );

const activityLogTypesSelector = createSelector(activityLogSelector, (activityLog) => [
  ...new Set(
    activityLog.filter((record) => isPreviousMonth(record.date)).map((record) => record.recordType)
  ),
]);

const activityLogGroupedByDaysSelector = (language: string) =>
  createSelector(activityLogSelector, (activityLog): ActivityLogGroupedByDay[] => {
    const activityLogByDaysDictionary = getActivityLogByDaysDictionary(activityLog, language);

    return getActivityLogGroupedByDay(activityLogByDaysDictionary);
  });

const recordsWithSelectedTypesSelector = (selectedTypes: ActivityLogRecordType[]) =>
  createSelector(activityLogSelector, (activityLog) =>
    activityLog.filter(
      (record) => selectedTypes.includes(record.recordType) && isPreviousMonth(record.date)
    )
  );

export const ActivityLogSelectors = {
  activityLogStateSelector,
  activityLogSelector,
  isActivityLogRecordRemovingSelector,
  selectRecordByIdSelector,
  activityLogDictionarySelector,
  isBulkRecordsRemovingInProgressSelector,
  relatedCategoryValueChangeRecordsByCategoryIdSelector,
  activityLogTypesSelector,
  activityLogGroupedByDaysSelector,
  recordsWithSelectedTypesSelector,
};

function getActivityLogByDaysDictionary(
  activityLog: ActivityLog,
  language: string
): ActivityLogGroupedByDayDictionary {
  return activityLog
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .reduce((group, record) => {
      const date = new Date(record.date);
      const dateKey = date.toLocaleDateString(language, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      group[dateKey] = group[dateKey] ?? [];
      group[dateKey].push(record);
      return group;
    }, {} as ActivityLogGroupedByDayDictionary);
}

function getActivityLogGroupedByDay(
  activityLogDictionary: ActivityLogGroupedByDayDictionary
): ActivityLogGroupedByDay[] {
  return Object.keys(activityLogDictionary).map((dateKey) => {
    const allRecords = activityLogDictionary[dateKey].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const categoryValueChangeRecords: CategoryValueChangeRecord[] = allRecords
      .filter(
        (activityLogRecord) =>
          activityLogRecord.recordType === ActivityLogRecordType.CategoryValueChange
      )
      .map((record) => record as CategoryValueChangeRecord);

    const incomeCategoryValueChangeRecordsSum: number = categoryValueChangeRecords
      .filter((record) => record.budgetType === BudgetType.Income)
      .reduce((sum, record) => sum + record.convertedValue, 0);

    const expenseCategoryValueChangeRecordsSum: number = categoryValueChangeRecords
      .filter((record) => record.budgetType === BudgetType.Expense)
      .reduce((sum, record) => sum + record.convertedValue, 0);

    return {
      date: dateKey,
      records: allRecords,
      sumOfCategoryValueChangeRecords:
        incomeCategoryValueChangeRecordsSum - expenseCategoryValueChangeRecordsSum,
    };
  });
}
