import { createSelector } from '@ngrx/store';
import { dataFeatureSelector } from './feature.selector';
import {
  ActivityLog,
  ActivityLogGroupedByDay,
  ActivityLogGroupedByDayDictionary,
  ActivityLogRecordType,
  BudgetType,
  CategoryValueChangeRecord,
  LanguagesEnum,
} from '@budget-tracker/models';

const activityLogStateSelector = createSelector(
  dataFeatureSelector,
  (dataFeatureState) => dataFeatureState.activityLogState
);

const activityLogDictionarySelector = createSelector(
  activityLogStateSelector,
  (state) => state.activityLogRecords.entities
);

const activityLogLoadedSelector = createSelector(
  activityLogStateSelector,
  (state) => state.isLoaded
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

const activityLogGroupedByDaysSelector = (language: LanguagesEnum) =>
  createSelector(activityLogSelector, (activityLog): ActivityLogGroupedByDay[] => {
    const activityLogByDaysDictionary = getActivityLogByDaysDictionary(activityLog, language);

    return getActivityLogGroupedByDay(activityLogByDaysDictionary);
  });

export const ActivityLogSelectors = {
  activityLogStateSelector,
  activityLogSelector,
  isActivityLogRecordRemovingSelector,
  selectRecordByIdSelector,
  activityLogDictionarySelector,
  isBulkRecordsRemovingInProgressSelector,
  activityLogGroupedByDaysSelector,
  activityLogLoadedSelector,
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
  return Object.keys(activityLogDictionary).map((dateKey): ActivityLogGroupedByDay => {
    const allRecords = activityLogDictionary[dateKey].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const categoryValueChangeRecords: CategoryValueChangeRecord[] = allRecords.filter(
      (activityLogRecord) =>
        activityLogRecord.recordType === ActivityLogRecordType.CategoryValueChange
    ) as CategoryValueChangeRecord[];

    const incomeCategoryValueChangeRecordsSum: number = sumOfCategoryValueChangeRecords(
      categoryValueChangeRecords.filter((record) => record.budgetType === BudgetType.Income)
    );

    const expenseCategoryValueChangeRecordsSum: number = sumOfCategoryValueChangeRecords(
      categoryValueChangeRecords.filter((record) => record.budgetType === BudgetType.Expense)
    );

    return {
      date: dateKey,
      records: allRecords,
      totalValueForDate: incomeCategoryValueChangeRecordsSum - expenseCategoryValueChangeRecordsSum,
    };
  });
}

function sumOfCategoryValueChangeRecords(records: CategoryValueChangeRecord[]) {
  return records.reduce((sum, record) => sum + record.convertedValue, 0);
}
