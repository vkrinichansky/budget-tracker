import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { ActivityLogGroupedByDays, ActivityLogRecordType } from '@budget-tracker/shared';
import { Observable, map } from 'rxjs';
import { BudgetTrackerFacadeService } from '../../../../services';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityLogComponent implements OnInit {
  private readonly rootTranslationKey = 'dashboard.activityLog';

  @HostBinding('class')
  private readonly classes = 'flex flex-col w-full h-full bg-white rounded-lg p-7 gap-7 overflow-hidden';

  readonly recordType = ActivityLogRecordType;

  activityLog$: Observable<ActivityLogGroupedByDays[]>;

  isEmpty$: Observable<boolean>;

  constructor(private budgetTrackerFacade: BudgetTrackerFacadeService) {}

  ngOnInit(): void {
    this.activityLog$ = this.budgetTrackerFacade.getActivityLogGroupedByDays();

    this.isEmpty$ = this.activityLog$.pipe(map((activitiLog) => !activitiLog.length));
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }
}
