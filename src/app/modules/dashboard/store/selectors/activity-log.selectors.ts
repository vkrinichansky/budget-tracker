import { createSelector } from '@ngrx/store';
import { dataFeatureSelector } from './feature.selector';
import {
  AccountValueEditRecord,
  ActivityLog,
  ActivityLogGroupedByDay,
  ActivityLogGroupedByDayDictionary,
  ActivityLogRecordType,
  BudgetType,
  CategoryValueChangeRecord,
  CurrenciesEnum,
  CurrencyExchangeRate,
} from '@budget-tracker/models';
import { isCurrentMonth } from '@budget-tracker/utils';

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

const activityLogGroupedByDaysSelector = (
  language: string,
  currency: CurrenciesEnum,
  exchangeRate: CurrencyExchangeRate
) =>
  createSelector(activityLogSelector, (activityLog): ActivityLogGroupedByDay[] => {
    const activityLogByDaysDictionary = getActivityLogByDaysDictionary(activityLog, language);

    return getActivityLogGroupedByDay(activityLogByDaysDictionary, currency, exchangeRate);
  });

const currentMonthAccountValueChangeRecordsSumSelector = (
  currency: CurrenciesEnum,
  exchangeRate: CurrencyExchangeRate
) =>
  createSelector(activityLogSelector, (records) =>
    sumOfAccountValueChangeRecords(
      records.filter(
        (record) =>
          record.recordType === ActivityLogRecordType.AccountValueChange &&
          isCurrentMonth(new Date(record.date))
      ) as AccountValueEditRecord[],
      currency,
      exchangeRate
    )
  );

export const ActivityLogSelectors = {
  activityLogStateSelector,
  activityLogSelector,
  isActivityLogRecordRemovingSelector,
  selectRecordByIdSelector,
  activityLogDictionarySelector,
  isBulkRecordsRemovingInProgressSelector,
  activityLogGroupedByDaysSelector,
  currentMonthAccountValueChangeRecordsSumSelector,
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
  activityLogDictionary: ActivityLogGroupedByDayDictionary,
  currency: CurrenciesEnum,
  exchangeRate: CurrencyExchangeRate
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

    const accountValueChangeRecordSum: number = sumOfAccountValueChangeRecords(
      allRecords.filter(
        (activityLogRecord) =>
          activityLogRecord.recordType === ActivityLogRecordType.AccountValueChange
      ) as AccountValueEditRecord[],
      currency,
      exchangeRate
    );

    return {
      date: dateKey,
      records: allRecords,
      totalValueForDate:
        incomeCategoryValueChangeRecordsSum -
        expenseCategoryValueChangeRecordsSum +
        accountValueChangeRecordSum,
    };
  });
}

function sumOfCategoryValueChangeRecords(records: CategoryValueChangeRecord[]) {
  return records.reduce((sum, record) => sum + record.convertedValue, 0);
}

function sumOfAccountValueChangeRecords(
  records: AccountValueEditRecord[],
  currency: CurrenciesEnum,
  exchangeRate: CurrencyExchangeRate
) {
  return records.reduce((sum, record) => {
    const difference = record.newValue - record.oldValue;

    return (
      sum +
      (record.account.currency.id === currency
        ? difference
        : Math.round(difference / exchangeRate[record.account.currency.id]))
    );
  }, 0);
}
