import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActivityLogFacadeService, BudgetType, CategoryValueChangeRecord } from '@budget-tracker/data';
import { ConfirmationModalService, ConfirmationModalTranslationData } from '@budget-tracker/design-system';
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
    this.confirmationModalService.openConfirmationModal(
      {
        questionTranslationKey: this.buildTranslationKey('removeConfirmationQuestion'),
        checkboxTranslationKey: this.buildTranslationKey('removeConfirmationCheckboxText'),
        remarkTranslationKey: this.buildTranslationKey(`removeConfirmationRemark.${this.record.budgetType}`),
        remarkTranslationParams: { value: this.record.value, categoryName: this.record.categoryName },
      },
      (shouldRevertChangesMadeByRecord) =>
        this.activityLogFacade.removeCategoryValueChangeRecord(this.record.id, shouldRevertChangesMadeByRecord),
      true
    );
  }
}
