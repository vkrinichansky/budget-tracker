import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { firstValueFrom, Observable } from 'rxjs';
import { ActivityLogActions, ActivityLogSelectors } from '../../store';
import {
  ActivityLogGroupedByDay,
  ActivityLogRecordUnitedType,
  ActivityLogEvents,
  RemoveCategoryValueChangeRecordEvent,
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

  // ===== SELECTORS =====
  activityLogLoaded(): Observable<boolean> {
    return this.store.select(ActivityLogSelectors.activityLogLoadedSelector);
  }

  getActivityLogGroupedByDays(): Observable<ActivityLogGroupedByDay[]> {
    const language = this.metadataService.currentLanguage;

    return this.store.select(ActivityLogSelectors.activityLogGroupedByDaysSelector(language));
  }

  getRecordById(recordId: string): Observable<ActivityLogRecordUnitedType> {
    return this.store.select(ActivityLogSelectors.selectRecordByIdSelector(recordId));
  }

  // ===== ACTIONS =====
  async loadActivityLog(): Promise<void> {
    const isLoaded = await firstValueFrom(this.activityLogLoaded());

    if (!isLoaded) {
      this.store.dispatch(ActivityLogActions.loadActivityLog());
    }
  }

  async addRecord(record: ActivityLogRecordUnitedType): Promise<void> {
    this.store.dispatch(ActivityLogActions.addRecord({ record }));

    return this.eventBus.waitFor(ActivityLogEvents.ADD_RECORD);
  }

  async removeRecord(recordId: string): Promise<void> {
    this.store.dispatch(
      ActivityLogActions.removeRecord({
        recordId,
      })
    );

    return this.eventBus.waitFor(ActivityLogEvents.REMOVE_CATEGORY_VALUE_CHANGE_RECORD, recordId);
  }

  async removeAllRecords(): Promise<void> {
    this.store.dispatch(ActivityLogActions.bulkRecordsRemove());

    return this.eventBus.waitFor(ActivityLogEvents.REMOVE_ALL_RECORDS);
  }

  // ===== FLOW TRIGGERS =====
  runRemoveCategoryValueChangeRecordFlow(recordId: string): Promise<void> {
    this.eventBus.emit<RemoveCategoryValueChangeRecordEvent>({
      type: ActivityLogEvents.REMOVE_CATEGORY_VALUE_CHANGE_RECORD_START,
      status: 'event',
      payload: {
        recordId,
      },
    });

    return this.eventBus.waitFor(
      ActivityLogEvents.REMOVE_CATEGORY_VALUE_CHANGE_RECORD_FINISH,
      recordId
    );
  }
}
