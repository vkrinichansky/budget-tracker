import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { ActivityLogFacadeService } from '@budget-tracker/data';
import { ActivityLogGroupedByDate, ActivityLogRecordType, ActivityLogRecordUnitedType } from '@budget-tracker/data';
import { Observable, map } from 'rxjs';

interface DateObject {
  date: string;
  sum: number;
}

type RenderingItemType = DateObject | ActivityLogRecordUnitedType;

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

  isBulkRecordsRemovingInProgress$: Observable<boolean>;

  constructor(private activityLogFacade: ActivityLogFacadeService) {}

  ngOnInit(): void {
    this.activityLog$ = this.activityLogFacade.getActivityLogGroupedByDays();

    this.itemsToRender$ = this.activityLog$.pipe(
      map((days) =>
        days.reduce(
          (previous, current) => [
            ...previous,
            { date: current.date, sum: current.sumOfCategoryValueChangeRecords },
            ...current.records,
          ],
          []
        )
      )
    );

    this.isEmpty$ = this.activityLog$.pipe(map((activitiLog) => !activitiLog.length));

    this.isBulkRecordsRemovingInProgress$ = this.activityLogFacade.isBulkRecordsRemovingInProgress();
  }

  trackBy(_: number, item: RenderingItemType): string {
    return this.isItemDateObject(item) ? (item as DateObject).date : (item as ActivityLogRecordUnitedType).id;
  }

  isItemDateObject(item: RenderingItemType): boolean {
    return 'date' in item && 'sum' in item;
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }
}
