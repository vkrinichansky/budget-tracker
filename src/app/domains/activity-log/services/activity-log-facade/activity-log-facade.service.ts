import { Injectable } from '@angular/core';
import { ActivityLogService } from '../activity-log-service/activity-log.service';
import { Observable } from 'rxjs';
import { ActivityLogGroupedByDay, ActivityLogRecordUnitedType } from '../../models';

@Injectable()
export class ActivityLogFacadeService {
  constructor(private readonly activityLogService: ActivityLogService) {}

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

  async addRecord(record: ActivityLogRecordUnitedType): Promise<void> {
    return this.activityLogService.addRecord(record);
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
}
