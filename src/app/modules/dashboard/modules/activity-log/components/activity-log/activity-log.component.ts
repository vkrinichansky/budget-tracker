import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { ActivityLogFacadeService } from '@budget-tracker/data';
import { ActivityLogRecordType, ActivityLogRecordUnitedType } from '@budget-tracker/data';
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
  @HostBinding('class')
  private readonly classes =
    'flex flex-col w-full h-full bg-white rounded-lg p-5 gap-y-4 overflow-hidden';

  readonly recordType = ActivityLogRecordType;

  isEmpty$: Observable<boolean>;

  itemsToRender$: Observable<RenderingItemType[]>;

  isBulkRecordsRemovingInProgress$: Observable<boolean>;

  shouldDisableRemoveButton$: Observable<boolean>;

  constructor(private activityLogFacade: ActivityLogFacadeService) {}

  ngOnInit(): void {
    this.initActivityLogListeners();

    this.isBulkRecordsRemovingInProgress$ =
      this.activityLogFacade.isBulkRecordsRemovingInProgress();

    this.shouldDisableRemoveButton$ = this.activityLogFacade
      .doPreviousMonthsRecordsExist()
      .pipe(map((doPreviousMonthsRecordsExist) => !doPreviousMonthsRecordsExist));
  }

  trackBy(_: number, item: RenderingItemType): string {
    return this.isItemDateObject(item)
      ? (item as DateObject).date
      : (item as ActivityLogRecordUnitedType).id;
  }

  isItemDateObject(item: RenderingItemType): boolean {
    return 'date' in item && 'sum' in item;
  }

  buildTranslationKey(key: string): string {
    return `dashboard.activityLog.${key}`;
  }

  private initActivityLogListeners(): void {
    const activityLog$ = this.activityLogFacade.getActivityLogGroupedByDays();

    this.itemsToRender$ = activityLog$.pipe(
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

    this.isEmpty$ = activityLog$.pipe(map((activitiLog) => !activitiLog.length));
  }
}
