import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ConfirmationModalService, SnackbarHandlerService } from '@budget-tracker/design-system';
import {
  ActivityLogRecordType,
  ActivityLogRecordUnitedType,
  TotalValueForDateByCurrency,
} from '../../models';
import { Observable, map } from 'rxjs';
import { getErrorMessage } from '@budget-tracker/shared-utils';
import { ActivityLogFacadeService } from '../../services';

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
        questionTranslationKey: 'activityLog.allRecordsRemoveConfirmationQuestion',
      },
      async () => {
        try {
          await this.activityLogFacade.removeAllRecords();

          this.snackbarHandler.showMessageSnackbar(
            'messages.activityLog.bulkActivityLogRecordsRemoved'
          );
        } catch (error) {
          this.snackbarHandler.showErrorSnackbar(getErrorMessage(error));
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
