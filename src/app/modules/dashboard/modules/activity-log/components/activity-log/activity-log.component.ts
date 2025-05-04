import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivityLogFacadeService } from '../../../../services';
import { ConfirmationModalService, SnackbarHandlerService } from '@budget-tracker/design-system';
import {
  ActivityLogRecordUnitedType,
  ActivityLogRecordType,
  TotalValueForDateByCurrency,
} from '@budget-tracker/models';
import { Observable, map } from 'rxjs';
import { ActionListenerService } from '@budget-tracker/utils';
import { ActivityLogActions } from '../../../../store';

interface DateObject {
  date: string;
  totalValueForDate: TotalValueForDateByCurrency[];
}

type RenderingItemType = DateObject | ActivityLogRecordUnitedType;

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrl: './activity-log.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ActivityLogComponent implements OnInit {
  readonly recordType = ActivityLogRecordType;

  isEmpty$: Observable<boolean>;
  itemsToRender$: Observable<RenderingItemType[]>;

  constructor(
    private readonly activityLogFacade: ActivityLogFacadeService,
    private readonly confirmationModalService: ConfirmationModalService,
    private readonly actionListener: ActionListenerService,
    private readonly snackbarHandler: SnackbarHandlerService
  ) {}

  ngOnInit(): void {
    this.initActivityLogListeners();
  }

  trackBy(_: number, item: RenderingItemType): string {
    return this.isItemDateObject(item)
      ? (item as DateObject).date
      : (item as ActivityLogRecordUnitedType).id;
  }

  isItemDateObject(item: RenderingItemType): boolean {
    return 'date' in item && 'totalValueForDate' in item;
  }

  openRemoveConfirmationModal(): void {
    this.confirmationModalService.openConfirmationModal(
      {
        questionTranslationKey: 'dashboard.activityLog.allRecordsRemoveConfirmationQuestion',
      },
      async () => {
        try {
          this.activityLogFacade.removeAllRecords();

          await this.actionListener.waitForResult(
            ActivityLogActions.bulkRecordsRemoved,
            ActivityLogActions.bulkRecordsRemoveFail
          );

          this.snackbarHandler.showBulkActivityLogRecordsRemovedSnackbar();
        } catch {
          this.snackbarHandler.showGeneralErrorSnackbar();
        }
      }
    );
  }

  private initActivityLogListeners(): void {
    const activityLog$ = this.activityLogFacade.getActivityLogGroupedByDays();

    this.itemsToRender$ = activityLog$.pipe(
      map((days) =>
        days.reduce(
          (previous, current) => [
            ...previous,
            { date: current.date, totalValueForDate: current.totalValueForDate },
            ...current.records,
          ],
          []
        )
      )
    );

    this.isEmpty$ = activityLog$.pipe(map((activitiLog) => !activitiLog.length));
  }
}
