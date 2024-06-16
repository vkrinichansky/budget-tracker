import { Injectable } from '@angular/core';
import { LanguageService } from '@budget-tracker/shared';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { ActivityLogSelectors } from '../../store';
import {
  ActivityLog,
  ActivityLogGroupedByDate,
  CategoryValueChangeRecord,
  ActivityLogGroupedByDateInObject,
  ActivityLogRecordType,
  SumByDate,
  BudgetType,
} from '../../models';

@Injectable()
export class ActivityLogFacadeService {
  constructor(
    private store: Store,
    private languageService: LanguageService
  ) {}

  getActivityLog(): Observable<ActivityLog> {
    return this.store.select(ActivityLogSelectors.activityLogSelector);
  }

  getActivityLogGroupedByDays(): Observable<ActivityLogGroupedByDate[]> {
    return this.getActivityLog().pipe(
      map((activityLog) => this.groupActivityLogByDaysInObject(activityLog)),
      map((activityLogInObject) => this.activityLogByDateInObjectToArray(activityLogInObject))
    );
  }

  getActivityLogGroupedByDate(): Observable<ActivityLogGroupedByDate[]> {
    return this.getActivityLog().pipe(
      map((activityLog) => this.filterOnlyCategoryValueChangeRecords(activityLog)),
      map((filteredAL) => this.groupActivityLogByMonthsInObject(filteredAL, this.languageService.getCurrentLanguage())),
      map((ALObject) => this.activityLogByDateInObjectToArray(ALObject))
    );
  }

  getSumsByDays(): Observable<SumByDate> {
    return this.getActivityLog().pipe(
      map((activityLog) => this.groupActivityLogByDaysInObject(activityLog)),
      map((activityLogInObject) => {
        const sumsByDays: SumByDate = {};
        Object.keys(activityLogInObject).forEach((date) => {
          const categoryValueChangeRecords: CategoryValueChangeRecord[] = activityLogInObject[date]
            .filter((record) => record.recordType === ActivityLogRecordType.CategoryValueChange)
            .map((record) => record as CategoryValueChangeRecord);

          const incomeCategoryValueChangeRecordsSum: number = categoryValueChangeRecords
            .filter((record) => record.budgetType === BudgetType.Income)
            .reduce((sum, record) => sum + record.value, 0);

          const expenseCategoryValueChangeRecordsSum: number = categoryValueChangeRecords
            .filter((record) => record.budgetType === BudgetType.Expense)
            .reduce((sum, record) => sum + record.value, 0);

          sumsByDays[date] = incomeCategoryValueChangeRecordsSum - expenseCategoryValueChangeRecordsSum;
        });

        return sumsByDays;
      })
    );
  }

  private groupActivityLogByDaysInObject(activityLog: ActivityLog): ActivityLogGroupedByDateInObject {
    const language = this.languageService.getCurrentLanguage();
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
        }) as ActivityLogGroupedByDate
    );
  }

  private filterOnlyCategoryValueChangeRecords(activityLog: ActivityLog): ActivityLog {
    return activityLog
      .filter((activityLogRecord) => activityLogRecord.recordType === ActivityLogRecordType.CategoryValueChange)
      .filter((activityLogRecord) => !(activityLogRecord as CategoryValueChangeRecord).isReset);
  }
}
