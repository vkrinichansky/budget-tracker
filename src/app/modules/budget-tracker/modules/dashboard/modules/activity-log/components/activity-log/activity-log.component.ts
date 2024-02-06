import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { ActivityLogFacadeService } from '@budget-tracker/data';
import { ActivityLogGroupedByDate, ActivityLogRecordType, ActivityLogRecordUnitedType } from '@budget-tracker/data';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityLogComponent implements OnInit {
  private readonly rootTranslationKey = 'dashboard.activityLog';

  @HostBinding('class')
  private readonly classes = 'flex flex-col w-full h-full bg-white rounded-lg p-7 gap-7 overflow-hidden';

  readonly recordType = ActivityLogRecordType;

  activityLog$: Observable<ActivityLogGroupedByDate[]>;

  isEmpty$: Observable<boolean>;

  constructor(private activityLogFacade: ActivityLogFacadeService) {}

  ngOnInit(): void {
    this.activityLog$ = this.activityLogFacade.getActivityLogGroupedByDays();

    this.isEmpty$ = this.activityLog$.pipe(map((activitiLog) => !activitiLog.length));
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }

  trackByDate(activitiLogGroup: ActivityLogGroupedByDate): string {
    return activitiLogGroup.date;
  }

  trackByRecordId(activitiLogRecord: ActivityLogRecordUnitedType): string {
    return activitiLogRecord.id;
  }
}
