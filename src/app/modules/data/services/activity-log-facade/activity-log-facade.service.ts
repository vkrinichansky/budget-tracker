import { Injectable } from '@angular/core';
import { LanguageService } from '@budget-tracker/shared';
import { Store } from '@ngrx/store';
import { Observable, firstValueFrom, map } from 'rxjs';
import { ActivityLogActions, ActivityLogSelectors } from '../../store';
import {
  ActivityLog,
  ActivityLogGroupedByDate,
  CategoryValueChangeRecord,
  ActivityLogGroupedByDateDictionary,
  ActivityLogRecordType,
  ActivityLogRecordUnitedType,
  Category,
  BudgetType,
  Account,
} from '../../models';
import { Dictionary } from '@ngrx/entity';
import { CategoriesFacadeService } from '../categories-facade/categories-facade.service';
import { isPreviousMonth } from '@budget-tracker/utils';
import { AccountsFacadeService } from '../accounts-facade/accounts-facade.service';

@Injectable()
export class ActivityLogFacadeService {
  constructor(
    private store: Store,
    private languageService: LanguageService,
    private categoriesFacade: CategoriesFacadeService,
    private accountsFacade: AccountsFacadeService
  ) {}

  getActivityLogDictionary(): Observable<Dictionary<ActivityLogRecordUnitedType>> {
    return this.store.select(ActivityLogSelectors.activityLogDictionarySelector);
  }

  getActivityLog(): Observable<ActivityLog> {
    return this.store.select(ActivityLogSelectors.activityLogSelector);
  }

  getActivityLogTypes(): Observable<ActivityLogRecordType[]> {
    return this.getActivityLog().pipe(
      map((activityLog) => [
        ...new Set(activityLog.filter((record) => isPreviousMonth(record.date)).map((record) => record.recordType)),
      ])
    );
  }

  getActivityLogGroupedByDays(): Observable<ActivityLogGroupedByDate[]> {
    return this.getActivityLog().pipe(
      map((activityLog) => this.getActivityLogByDaysDictionary(activityLog)),
      map((activityLogDictionary) => {
        return Object.keys(activityLogDictionary).map((dateKey) => {
          const allRecords = activityLogDictionary[dateKey].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );

          const categoryValueChangeRecords: CategoryValueChangeRecord[] =
            this.filterOnlyCategoryValueChangeRecords(allRecords);

          const incomeCategoryValueChangeRecordsSum: number = categoryValueChangeRecords
            .filter((record) => record.budgetType === BudgetType.Income)
            .reduce((sum, record) => sum + record.value, 0);

          const expenseCategoryValueChangeRecordsSum: number = categoryValueChangeRecords
            .filter((record) => record.budgetType === BudgetType.Expense)
            .reduce((sum, record) => sum + record.value, 0);

          return {
            date: dateKey,
            records: allRecords,
            sumOfCategoryValueChangeRecords: incomeCategoryValueChangeRecordsSum - expenseCategoryValueChangeRecordsSum,
          };
        });
      })
    );
  }

  getPreviousMonthsRecords(): Observable<ActivityLog> {
    return this.getActivityLog().pipe(
      map((activityLog) => activityLog.filter((record) => isPreviousMonth(record.date)))
    );
  }

  doPreviousMonthsRecordsExist(): Observable<boolean> {
    return this.getPreviousMonthsRecords().pipe(map((records) => !!records.length));
  }

  isActivityLogRecordRemoving(recordId: string): Observable<boolean> {
    return this.store
      .select(ActivityLogSelectors.removingRecordsIdsSelector)
      .pipe(map((removingRecordsIds) => removingRecordsIds.includes(recordId)));
  }

  isBulkRecordsRemovingInProgress(): Observable<boolean> {
    return this.store.select(ActivityLogSelectors.isBulkRecordsRemovingInProgressSelector);
  }

  // RECORDS REMOVING
  removeActivityLogRecord(recordId: string): void {
    this.store.dispatch(ActivityLogActions.removeRecord({ recordId }));
  }

  async removeCategoryValueChangeRecord(recordId: string): Promise<void> {
    const record: CategoryValueChangeRecord = await firstValueFrom(
      this.getActivityLogDictionary().pipe(map((dictionary) => dictionary[recordId] as CategoryValueChangeRecord))
    );
    const category = structuredClone(await firstValueFrom(this.categoriesFacade.getCategoryById(record.categoryId)));
    const account = structuredClone(await firstValueFrom(this.accountsFacade.getAccountById(record.accountId)));

    let updatedCategory: Category;
    let updatedAccount: Account;

    if (category.value - record.value < 0) {
      updatedCategory = {
        ...category,
        value: 0,
      };
    } else {
      updatedCategory = {
        ...category,
        value: category.value - record.value,
      };
    }

    if (account) {
      switch (record.budgetType) {
        case BudgetType.Income:
          if (account.value - record.value < 0) {
            updatedAccount = {
              ...account,
              value: 0,
            };
          } else {
            updatedAccount = {
              ...account,
              value: account.value - record.value,
            };
          }

          break;

        case BudgetType.Expense:
          updatedAccount = {
            ...account,
            value: account.value + record.value,
          };

          break;
      }
    }
    this.store.dispatch(
      ActivityLogActions.removeCategoryValueChangeRecord({
        record,
        updatedAccount,
        updatedCategory,
      })
    );
  }

  async removeRecordsBySelectedTypes(selectedTypes: ActivityLogRecordType[]): Promise<void> {
    const records = await firstValueFrom(
      this.getActivityLog().pipe(
        map((records) =>
          records.filter((record) => selectedTypes.includes(record.recordType) && isPreviousMonth(record.date))
        )
      )
    );

    this.store.dispatch(ActivityLogActions.bulkRecordsRemove({ records }));
  }

  private getActivityLogByDaysDictionary(activityLog: ActivityLog): ActivityLogGroupedByDateDictionary {
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
      }, {} as ActivityLogGroupedByDateDictionary);
  }

  private filterOnlyCategoryValueChangeRecords(activityLog: ActivityLog): CategoryValueChangeRecord[] {
    return activityLog
      .filter((activityLogRecord) => activityLogRecord.recordType === ActivityLogRecordType.CategoryValueChange)
      .map((record) => record as CategoryValueChangeRecord);
  }
}
