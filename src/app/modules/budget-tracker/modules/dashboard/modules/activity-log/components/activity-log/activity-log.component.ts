import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { ActivityLogFacadeService } from '@budget-tracker/data';
import { ActivityLogGroupedByDate, ActivityLogRecordType, ActivityLogRecordUnitedType } from '@budget-tracker/data';
import { Observable, map } from 'rxjs';

type RenderingItemType = string | ActivityLogRecordUnitedType;

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityLogComponent implements OnInit {
  private readonly rootTranslationKey = 'dashboard.activityLog';

  @HostBinding('class')
  private readonly classes = 'flex flex-col w-full h-full bg-white rounded-lg p-5 gap-y-4 overflow-hidden';

  readonly recordType = ActivityLogRecordType;

  activityLog$: Observable<ActivityLogGroupedByDate[]>;

  isEmpty$: Observable<boolean>;

  itemsToRender$: Observable<RenderingItemType[]>;

  constructor(private activityLogFacade: ActivityLogFacadeService) {}

  ngOnInit(): void {
    this.activityLog$ = this.activityLogFacade.getActivityLogGroupedByDays();

    this.itemsToRender$ = this.activityLog$.pipe(
      map((days) => days.reduce((previous, current) => [...previous, current.date, ...current.records], []))
    );

    this.isEmpty$ = this.activityLog$.pipe(map((activitiLog) => !activitiLog.length));

    this.activityLogFacade.getSumsByDays().subscribe((sums) => console.log(sums));
  }

  trackBy(_: number, item: RenderingItemType): string {
    return this.isItemDate(item) ? (item as string) : (item as ActivityLogRecordUnitedType).id;
  }

  isItemDate(item: RenderingItemType): boolean {
    return typeof item === 'string';
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }
}
