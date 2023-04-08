import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivityLogGroupedByDays, ActivityLogRecordType } from '@budget-tracker/shared';
import { Observable, map, tap } from 'rxjs';
import { BudgetTrackerFacadeService } from 'src/app/modules/budget-tracker/services';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityLogComponent implements OnInit {
  private readonly rootTranslationKey = 'dashboard.activityLog';

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
