import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import {
  ActivityLogFacadeService,
  BudgetType,
  CategoryValueChangeRecord,
} from '@budget-tracker/data';
import { ConfirmationModalService } from '@budget-tracker/design-system';
import { isPreviousMonth } from '@budget-tracker/utils';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category-value-change-record',
  templateUrl: './category-value-change-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryValueChangeRecordComponent implements OnInit {
  @Input()
  record: CategoryValueChangeRecord;

  isRecordRemoving$: Observable<boolean>;

  get colorClass(): string {
    switch (this.record.budgetType) {
      case BudgetType.Income:
        return 'text-dark-green';

      case BudgetType.Expense:
        return 'text-red';
    }
  }

  get symbol(): string {
    switch (this.record.budgetType) {
      case BudgetType.Income:
        return '\u002B';

      case BudgetType.Expense:
        return '\u2212';
    }
  }

  get isDoubleValue(): boolean {
    return this.record.value === this.record.convertedValue;
  }

  constructor(
    private confirmationModalService: ConfirmationModalService,
    private activityLogFacade: ActivityLogFacadeService
  ) {}

  ngOnInit(): void {
    this.isRecordRemoving$ = this.activityLogFacade.isActivityLogRecordRemoving(this.record.id);
  }

  removeHandler(): void {
    if (isPreviousMonth(this.record.date)) {
      this.activityLogFacade.removeActivityLogRecord(this.record.id);
    } else {
      this.confirmationModalService.openConfirmationModal(
        {
          questionTranslationKey:
            'dashboard.activityLog.categoryValueChangeRecord.removeConfirmationQuestion',
          remarkTranslationKey:
            'dashboard.activityLog.categoryValueChangeRecord.removeConfirmationRemark',
          remarkTranslationParams: {
            accountName: this.record.account.name,
            categoryName: this.record.category.name,
          },
        },
        () => this.activityLogFacade.removeCategoryValueChangeRecord(this.record.id)
      );
    }
  }
}
