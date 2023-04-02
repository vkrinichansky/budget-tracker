import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivityLogGroupedByDays, ActivityLogRecordType } from '@budget-tracker/shared';
import { Observable, tap } from 'rxjs';
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

  constructor(private budgetTrackerFacade: BudgetTrackerFacadeService) {}

  ngOnInit(): void {
    this.activityLog$ = this.budgetTrackerFacade.getActivityLogGroupedByDays();
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }
}
