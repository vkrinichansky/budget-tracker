import { createSelector } from '@ngrx/store';
import { dataFeatureSelector } from './feature-selector';
import {
  ActivityLog,
  ActivityLogGroupedByDay,
  ActivityLogGroupedByDayDictionary,
  ActivityLogRecordType,
  CategoryValueChangeRecord,
} from '../models';
import { LanguagesEnum } from '@budget-tracker/metadata';
import { BudgetType } from '@budget-tracker/shared-models';

const activityLogDictionarySelector = createSelector(
  dataFeatureSelector,
  (state) => state.activityLogRecords.entities
);

const activityLogLoadedSelector = createSelector(dataFeatureSelector, (state) => state.isLoaded);

const activityLogSelector = createSelector(dataFeatureSelector, (state) =>
  Object.values(state.activityLogRecords.entities)
);

const selectRecordByIdSelector = (recordId: string) =>
  createSelector(activityLogSelector, (activityLog) =>
    activityLog.find((record) => record.id === recordId)
  );

const activityLogGroupedByDaysSelector = (language: LanguagesEnum) =>
  createSelector(activityLogSelector, (activityLog): ActivityLogGroupedByDay[] => {
    const activityLogByDaysDictionary = getActivityLogByDaysDictionary(activityLog, language);

    return getActivityLogGroupedByDay(activityLogByDaysDictionary);
  });

export const ActivityLogSelectors = {
  dataFeatureSelector,
  activityLogSelector,
  selectRecordByIdSelector,
  activityLogDictionarySelector,
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
        activityLogRecord.recordType === ActivityLogRecordType.CATEGORY_VALUE_CHANGE
    ) as CategoryValueChangeRecord[];

    const incomeCategoryValueChangeRecordsSum: number = sumOfCategoryValueChangeRecords(
      BudgetType.INCOME,
      categoryValueChangeRecords
    );

    const expenseCategoryValueChangeRecordsSum: number = sumOfCategoryValueChangeRecords(
      BudgetType.EXPENSE,
      categoryValueChangeRecords
    );

    const totalValueForDate: number =
      incomeCategoryValueChangeRecordsSum - expenseCategoryValueChangeRecordsSum;

    return {
      date: dateKey,
      records: allRecords,
      totalValueForDate,
    };
  });
}

function sumOfCategoryValueChangeRecords(
  budgetType: BudgetType,
  records: CategoryValueChangeRecord[]
) {
  return records
    .filter((record) => record.budgetType === budgetType)
    .reduce((sum, record) => sum + record.convertedValue, 0);
}
