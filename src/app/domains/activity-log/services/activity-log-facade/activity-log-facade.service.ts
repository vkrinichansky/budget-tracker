import { Injectable } from '@angular/core';
import { ActivityLogService } from '../activity-log-service/activity-log.service';
import { Observable } from 'rxjs';
import { ActivityLogGroupedByDay, ActivityLogRecordUnitedType } from '../../models';

@Injectable()
export class ActivityLogFacadeService {
  constructor(private readonly activityLogService: ActivityLogService) {}

  loadActivityLog(): Promise<void> {
    return this.activityLogService.loadActivityLog();
  }

  getActivityLogGroupedByDays(): Observable<ActivityLogGroupedByDay[]> {
    return this.activityLogService.getActivityLogGroupedByDays();
  }

  addRecord(record: ActivityLogRecordUnitedType): Promise<void> {
    return this.activityLogService.addRecord(record);
  }

  removeRecord(recordId: string): Promise<void> {
    return this.activityLogService.removeRecord(recordId);
  }

  removeAllRecords(): Promise<void> {
    return this.activityLogService.removeAllRecords();
  }
}
