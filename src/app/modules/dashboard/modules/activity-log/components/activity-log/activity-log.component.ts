import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivityLogFacadeService } from '@budget-tracker/data';
import { ConfirmationModalService } from '@budget-tracker/design-system';
import { ActivityLogRecordUnitedType, ActivityLogRecordType } from '@budget-tracker/models';
import { Observable, map } from 'rxjs';

interface DateObject {
  date: string;
  sum: number;
}

type RenderingItemType = DateObject | ActivityLogRecordUnitedType;

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrl: './activity-log.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityLogComponent implements OnInit {
  private readonly confirmationModalService = inject(ConfirmationModalService);
  private readonly activityLogFacade = inject(ActivityLogFacadeService);

  readonly recordType = ActivityLogRecordType;

  isEmpty$: Observable<boolean>;

  itemsToRender$: Observable<RenderingItemType[]>;

  isBulkRecordsRemovingInProgress$: Observable<boolean>;

  ngOnInit(): void {
    this.initActivityLogListeners();

    this.isBulkRecordsRemovingInProgress$ =
      this.activityLogFacade.isBulkRecordsRemovingInProgress();
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

  openRemoveConfirmationModal(): void {
    this.confirmationModalService.openConfirmationModal(
      {
        questionTranslationKey: this.buildTranslationKey('allRecordsRemoveConfirmationQuestion'),
      },
      () => this.activityLogFacade.removeAllRecords()
    );
  }

  private initActivityLogListeners(): void {
    const activityLog$ = this.activityLogFacade.getActivityLogGroupedByDays();

    this.itemsToRender$ = activityLog$.pipe(
      map((days) =>
        days.reduce(
          (previous, current) => [
            ...previous,
            { date: current.date, sum: current.totalValueForDate },
            ...current.records,
          ],
          []
        )
      )
    );

    this.isEmpty$ = activityLog$.pipe(map((activitiLog) => !activitiLog.length));
  }
}
