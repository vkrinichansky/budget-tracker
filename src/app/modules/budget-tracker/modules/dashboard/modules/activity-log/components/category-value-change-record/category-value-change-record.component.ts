import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActivityLogFacadeService, BudgetType, CategoryValueChangeRecord } from '@budget-tracker/data';
import { ConfirmationModalService } from '@budget-tracker/design-system';
import { isPreviousMonth } from '@budget-tracker/utils';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category-value-change-record',
  templateUrl: './category-value-change-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryValueChangeRecordComponent implements OnInit {
  readonly budgetType = BudgetType;

  @Input()
  record: CategoryValueChangeRecord;

  isRecordRemoving$: Observable<boolean>;

  constructor(
    private confirmationModalService: ConfirmationModalService,
    private activityLogFacade: ActivityLogFacadeService
  ) {}

  ngOnInit(): void {
    this.isRecordRemoving$ = this.activityLogFacade.isActivityLogRecordRemoving(this.record.id);
  }

  buildTranslationKey(key: string): string {
    return `dashboard.activityLog.categoryValueChangeRecord.${key}`;
  }

  removeHandler(): void {
    if (isPreviousMonth(this.record.date)) {
      this.activityLogFacade.removeActivityLogRecord(this.record.id);
    } else {
      this.confirmationModalService.openConfirmationModal(
        {
          questionTranslationKey: this.buildTranslationKey('removeConfirmationQuestion'),
          remarkTranslationKey: this.buildTranslationKey(`removeConfirmationRemark`),
          remarkTranslationParams: { accountName: this.record.accountName, categoryName: this.record.categoryName },
        },
        () => this.activityLogFacade.removeCategoryValueChangeRecord(this.record.id)
      );
    }
  }
}
