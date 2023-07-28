import { Injectable } from '@angular/core';
import {
  ActivityLogGroupedByDate,
  ActivityLog,
  ActivityLogGroupedByDateInObject,
  LanguageService,
  ActivityLogRecordType,
  CategoryValueChangeRecord,
  BudgetType,
} from '@budget-tracker/shared';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, filter, map } from 'rxjs';
import { ActivityLogSelectors } from '../../store';

@Injectable()
export class ActivityLogFacadeService {
  constructor(private store: Store, private languageService: LanguageService) {}

  getActivityLog(): Observable<ActivityLog> {
    return this.store.select(ActivityLogSelectors.activityLogSelector);
  }

  getActivityLogGroupedByDays(): Observable<ActivityLogGroupedByDate[]> {
    return combineLatest([
      this.getActivityLog(),
      this.languageService.getLanguageObs().pipe(filter((language) => !!language)),
    ]).pipe(
      map(([activityLog, language]) => this.groupActivityLogByDaysInObject(activityLog, language)),
      map((activityLogInObject) => this.activityLogByDateInObjectToArray(activityLogInObject))
    );
  }

  getMonthlyStatistics(): Observable<
    {
      date: string;
      incomeValue: number;
      expenseValue: number;
    }[]
  > {
    return this.getActivityLog().pipe(
      map((activityLog) => this.filterOnlyCategoryValueChangeRecords(activityLog)),
      map((filteredAL) => this.groupActivityLogByMonthsInObject(filteredAL, this.languageService.getLanguage())),
      map((ALObject) => this.activityLogByDateInObjectToArray(ALObject)),
      map((ALByDates) =>
        ALByDates.map((ALDate) => ({
          date: ALDate.date,
          incomeRecords: ALDate.records.filter(
            (record) => (record as CategoryValueChangeRecord).budgetType === BudgetType.Income
          ),
          expenseRecords: ALDate.records.filter(
            (record) => (record as CategoryValueChangeRecord).budgetType === BudgetType.Expense
          ),
        }))
      ),
      map((statistics) =>
        statistics.map((statisticsItem) => ({
          date: statisticsItem.date,
          incomeValue: statisticsItem.incomeRecords.reduce(
            (acc, currentValue) => acc + (currentValue as CategoryValueChangeRecord).value,
            0
          ),
          expenseValue: statisticsItem.expenseRecords.reduce(
            (acc, currentValue) => acc + (currentValue as CategoryValueChangeRecord).value,
            0
          ),
        }))
      )
    );
  }

  private groupActivityLogByDaysInObject(activityLog: ActivityLog, language: string): ActivityLogGroupedByDateInObject {
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
      }, {} as ActivityLogGroupedByDateInObject);
  }

  private groupActivityLogByMonthsInObject(
    activityLog: ActivityLog,
    language: string
  ): ActivityLogGroupedByDateInObject {
    return activityLog
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .reduce((group, record) => {
        const date = new Date(record.date);
        const dateKey = date.toLocaleDateString(language, {
          year: 'numeric',
          month: 'short',
        });

        group[dateKey] = group[dateKey] ?? [];
        group[dateKey].push(record);
        return group;
      }, {} as ActivityLogGroupedByDateInObject);
  }

  private activityLogByDateInObjectToArray(
    activityLogInObject: ActivityLogGroupedByDateInObject
  ): ActivityLogGroupedByDate[] {
    return Object.keys(activityLogInObject).map(
      (key) =>
        ({
          date: key,
          records: activityLogInObject[key].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        } as ActivityLogGroupedByDate)
    );
  }

  private filterOnlyCategoryValueChangeRecords(activityLog: ActivityLog): ActivityLog {
    return activityLog
      .filter((activityLogRecord) => activityLogRecord.recordType === ActivityLogRecordType.CategoryValueChange)
      .filter((activityLogRecord) => !(activityLogRecord as CategoryValueChangeRecord).isReset);
  }
}
