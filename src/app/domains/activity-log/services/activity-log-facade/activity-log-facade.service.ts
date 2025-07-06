import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { firstValueFrom, Observable } from 'rxjs';
import { ActivityLogActions, ActivityLogSelectors } from '../../store';
import { ActivityLogGroupedByDay, ActivityLogRecordUnitedType } from '../../models';
import { MetadataService } from '@budget-tracker/metadata';

@Injectable()
export class ActivityLogFacadeService {
  constructor(
    private store: Store,
    private metadataService: MetadataService
  ) {}

  async loadActivityLog(): Promise<void> {
    const isLoaded = await firstValueFrom(
      this.store.select(ActivityLogSelectors.activityLogLoadedSelector)
    );

    if (!isLoaded) {
      this.store.dispatch(ActivityLogActions.loadActivityLog());
    }
  }

  getActivityLogGroupedByDays(): Observable<ActivityLogGroupedByDay[]> {
    const language = this.metadataService.currentLanguage;

    return this.store.select(ActivityLogSelectors.activityLogGroupedByDaysSelector(language));
  }

  addRecord(record: ActivityLogRecordUnitedType): void {
    this.store.dispatch(ActivityLogActions.addRecord({ record }));
  }

  async removeRecord(recordId: string): Promise<void> {
    // const category = structuredClone(
    //   await firstValueFrom(this.categoriesFacade.getCategoryById(record.category.id))
    // );
    // const account = structuredClone(
    //   await firstValueFrom(this.accountsFacade.getAccountById(record.account.id))
    // );

    // const updatedCategoryValue =
    //   category.value - record.convertedValue < 0 ? 0 : category.value - record.convertedValue;

    // let updatedAccountValue: number;

    // switch (record.budgetType) {
    //   case BudgetType.Income:
    //     updatedAccountValue = account.value - record.value < 0 ? 0 : account.value - record.value;

    //     break;

    //   case BudgetType.Expense:
    //     updatedAccountValue = account.value + record.value;

    //     break;
    // }

    this.store.dispatch(
      ActivityLogActions.removeRecord({
        recordId,
      })
    );
  }

  async removeAllRecords(): Promise<void> {
    this.store.dispatch(ActivityLogActions.bulkRecordsRemove());
  }
}
