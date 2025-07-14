import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { firstValueFrom, Observable } from 'rxjs';
import { ActivityLogActions, ActivityLogSelectors } from '../../store';
import {
  ActivityLogGroupedByDay,
  ActivityLogRecordUnitedType,
  ActivityLogEvents,
} from '../../models';
import { MetadataService } from '@budget-tracker/metadata';
import { EventBusService } from '@budget-tracker/utils';

@Injectable()
export class ActivityLogService {
  constructor(
    private store: Store,
    private metadataService: MetadataService,
    private eventBus: EventBusService
  ) {}

  async loadActivityLog(): Promise<void> {
    const isLoaded = await firstValueFrom(this.activityLogLoaded());

    if (!isLoaded) {
      this.store.dispatch(ActivityLogActions.loadActivityLog());
    }
  }

  activityLogLoaded(): Observable<boolean> {
    return this.store.select(ActivityLogSelectors.activityLogLoadedSelector);
  }

  getActivityLogGroupedByDays(): Observable<ActivityLogGroupedByDay[]> {
    const language = this.metadataService.currentLanguage;

    return this.store.select(ActivityLogSelectors.activityLogGroupedByDaysSelector(language));
  }

  async addRecord(record: ActivityLogRecordUnitedType): Promise<void> {
    this.store.dispatch(ActivityLogActions.addRecord({ record }));

    return this.eventBus.waitFor(ActivityLogEvents.ADD_RECORD);
  }

  async removeRecord(recordId: string): Promise<void> {
    // const category = structuredClone(
    //   await firstValueFrom(this.categoryFacade.getCategoryById(record.category.id))
    // );
    // const account = structuredClone(
    //   await firstValueFrom(this.accountFacade.getAccountById(record.account.id))
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
