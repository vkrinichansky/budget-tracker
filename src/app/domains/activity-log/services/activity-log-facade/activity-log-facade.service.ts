import { Injectable } from '@angular/core';
import { ActivityLogService } from '../activity-log-service/activity-log.service';
import { Observable } from 'rxjs';
import { ActivityLogGroupedByDay, ActivityLogRecordUnitedType } from '../../models';
import { DocumentReference } from '@angular/fire/firestore';
import { ActivityLogApiService } from '../activity-log-api-service/activity-log-api.service';

@Injectable()
export class ActivityLogFacadeService {
  constructor(
    private readonly activityLogService: ActivityLogService,
    private readonly activityLogApiService: ActivityLogApiService
  ) {}

  // ===== SELECTORS =====
  activityLogLoaded(): Observable<boolean> {
    return this.activityLogService.activityLogLoaded();
  }

  getActivityLogGroupedByDays(): Observable<ActivityLogGroupedByDay[]> {
    return this.activityLogService.getActivityLogGroupedByDays();
  }

  getRecordById(recordId: string): Observable<ActivityLogRecordUnitedType> {
    return this.activityLogService.getRecordById(recordId);
  }

  // ===== ACTIONS =====
  loadActivityLog(): void {
    this.activityLogService.loadActivityLog();
  }

  addRecord(record: ActivityLogRecordUnitedType): void {
    this.activityLogService.addRecord(record);
  }

  async removeRecord(recordId: string): Promise<void> {
    return this.activityLogService.removeRecord(recordId);
  }

  async removeAllRecords(): Promise<void> {
    return this.activityLogService.removeAllRecords();
  }

  // ===== FLOW TRIGGERS =====
  async runRemoveCategoryValueChangeRecordFlow(recordId: string): Promise<void> {
    return this.activityLogService.runRemoveCategoryValueChangeRecordFlow(recordId);
  }

  // ===== UTILS =====
  getActivityLogDocRef(): DocumentReference {
    return this.activityLogApiService.getDocRef();
  }
}
