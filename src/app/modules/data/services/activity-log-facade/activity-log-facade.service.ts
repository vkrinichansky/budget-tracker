import { Injectable } from '@angular/core';
import { LanguageService } from '@budget-tracker/shared';
import { Store } from '@ngrx/store';
import { Observable, firstValueFrom, map } from 'rxjs';
import { ActivityLogActions, ActivityLogSelectors } from '../../store';
import {
  ActivityLog,
  ActivityLogGroupedByDate,
  CategoryValueChangeRecord,
  ActivityLogGroupedByDateInObject,
  ActivityLogRecordType,
  ActivityLogRecordUnitedType,
  Category,
  BudgetType,
  RootValueChangeRecord,
  RootValueType,
  RootValueActionType,
} from '../../models';
import { Dictionary } from '@ngrx/entity';
import { CategoriesFacadeService } from '../categories-facade/categories-facade.service';
import { RootValuesFacadeService } from '../root-values-facade/root-values-facade.service';

@Injectable()
export class ActivityLogFacadeService {
  constructor(
    private store: Store,
    private languageService: LanguageService,
    private categoryFacade: CategoriesFacadeService,
    private rootValuesFacade: RootValuesFacadeService
  ) {}

  getActivityLogDictionary(): Observable<Dictionary<ActivityLogRecordUnitedType>> {
    return this.store.select(ActivityLogSelectors.activityLogDictionarySelector);
  }

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
      map((filteredAL) => this.groupActivityLogByMonthsInObject(filteredAL)),
      map((ALObject) => this.activityLogByDateInObjectToArray(ALObject))
    );
  }

  removeActivityLogRecord(recordId: string): void {
    this.store.dispatch(ActivityLogActions.removeActivityLogRecord({ recordId }));
  }

  isActivityLogRecordRemoving(recordId: string): Observable<boolean> {
    return this.store
      .select(ActivityLogSelectors.removingRecordsIdsSelector)
      .pipe(map((removingRecordsIds) => removingRecordsIds.includes(recordId)));
  }

  async removeCategoryValueChangeRecord(recordId: string, shouldRevertChangesMadeByRecord: boolean): Promise<void> {
    const record: CategoryValueChangeRecord = await firstValueFrom(
      this.getActivityLogDictionary().pipe(map((dictionary) => dictionary[recordId] as CategoryValueChangeRecord))
    );

    let updatedCategory: Category;
    let updatedCategories: Category[];
    let updatedBalanceValue: number;

    if (shouldRevertChangesMadeByRecord) {
      updatedBalanceValue = await firstValueFrom(
        this.rootValuesFacade.getFullBalanceValue().pipe(
          map((fullBalance) => {
            switch (record.budgetType) {
              case BudgetType.Income:
                if (fullBalance - record.value < 0) {
                  return 0;
                }

                return fullBalance - record.value;

              case BudgetType.Expense:
                return fullBalance + record.value;
            }
          })
        )
      );

      const result = await this.resolveRecordRelatedUpdatedCategory(record);

      updatedCategory = result.updatedCategory;
      updatedCategories = result.updatedCategories;
    }

    this.store.dispatch(
      ActivityLogActions.removeCategoryValueChangeRecord({
        record,
        updatedBalanceValue,
        updatedCategory,
        updatedCategories,
      })
    );
  }

  async removeRootValueChangeRecord(recordId: string, shouldRevertChangesMadeByRecord: boolean): Promise<void> {
    const record: RootValueChangeRecord = await firstValueFrom(
      this.getActivityLogDictionary().pipe(map((dictionary) => dictionary[recordId] as RootValueChangeRecord))
    );

    let valueToEdit: number;
    let updatedValue: number;

    if (shouldRevertChangesMadeByRecord) {
      switch (record.valueType) {
        case RootValueType.Balance:
          valueToEdit = await firstValueFrom(this.rootValuesFacade.getFullBalanceValue());

          break;

        case RootValueType.Savings:
          valueToEdit = await firstValueFrom(this.rootValuesFacade.getSavingsValue());

          break;

        case RootValueType.FreeMoney:
          valueToEdit = await firstValueFrom(this.rootValuesFacade.getFreeMoneyValue());

          break;
      }

      switch (record.actionType) {
        case RootValueActionType.Increase:
          if (valueToEdit - record.value < 0) {
            updatedValue = 0;
          } else {
            updatedValue = valueToEdit - record.value;
          }

          break;

        case RootValueActionType.Decrease:
          updatedValue = valueToEdit + record.value;

          break;

        case RootValueActionType.Edit:
          updatedValue = record.oldValue;

          break;
      }
    }

    this.store.dispatch(
      ActivityLogActions.removeRootValueChangeRecord({
        record,
        updatedValue,
        valueType: record.valueType,
      })
    );
  }

  private async resolveRecordRelatedUpdatedCategory(record: CategoryValueChangeRecord): Promise<{
    updatedCategory: Category;
    updatedCategories: Category[];
  }> {
    let updatedCategory = structuredClone(await this.getRecordRelatedCategory(record));
    let updatedCategories: Category[];

    if (updatedCategory) {
      const newValue = updatedCategory.value - record.value < 0 ? 0 : updatedCategory.value - record.value;

      updatedCategories = [
        ...(await firstValueFrom(this.categoryFacade.getCategoriesAccordingToBudgetType(updatedCategory.budgetType))),
      ];

      const updatedCategoryIndex = updatedCategories.findIndex((category) => category.id === updatedCategory.id);

      updatedCategories[updatedCategoryIndex].value = newValue;

      updatedCategory = {
        ...updatedCategory,
        value: newValue,
      };
    }

    return {
      updatedCategory,
      updatedCategories,
    };
  }

  private async getRecordRelatedCategory(record: CategoryValueChangeRecord): Promise<Category> {
    const categoriesAccordingToRecordBudgetType = await firstValueFrom(
      this.categoryFacade
        .getAllCategories()
        .pipe(map((categories) => categories.filter((category) => category.budgetType === record.budgetType)))
    );

    let category: Category;

    category = categoriesAccordingToRecordBudgetType.find((category) => category.id === record.categoryId);

    if (category) {
      return category;
    }

    category = categoriesAccordingToRecordBudgetType.find((category) => category.name === record.categoryName);

    if (category) {
      return category;
    }

    return null;
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

  private groupActivityLogByMonthsInObject(activityLog: ActivityLog): ActivityLogGroupedByDateInObject {
    const language = this.languageService.getCurrentLanguage();

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
    return activityLog.filter(
      (activityLogRecord) => activityLogRecord.recordType === ActivityLogRecordType.CategoryValueChange
    );
  }
}
