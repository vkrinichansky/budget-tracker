import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ConfirmationModalService, SnackbarHandlerService } from '@budget-tracker/design-system';
import { BudgetType } from '@budget-tracker/models';
import { ActionListenerService, isToday } from '@budget-tracker/utils';
import { Observable } from 'rxjs';
import { MetadataFacadeService, predefinedCurrenciesDictionary } from '@budget-tracker/metadata';
import { ActivityLogActions } from '../../store';
import { ActivityLogFacadeService } from '../../services';
import { CategoryValueChangeRecord } from '../../models';

@Component({
  selector: 'app-category-value-change-record',
  templateUrl: './category-value-change-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CategoryValueChangeRecordComponent {
  @Input()
  record: CategoryValueChangeRecord;

  shouldDisplayRemoveButton$: Observable<boolean>;

  get colorClass(): string {
    switch (this.record.budgetType) {
      case BudgetType.Income:
        return 'text-dark-green';

      case BudgetType.Expense:
        return 'text-dark-red';
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

  get isSingleValue(): boolean {
    return this.record.value === this.record.convertedValue;
  }

  get isToday(): boolean {
    return isToday(new Date(this.record.date));
  }

  get currencySymbol(): string {
    return predefinedCurrenciesDictionary[this.record.currency].symbol;
  }

  get shouldDisplayRemoveButton(): boolean {
    return (
      this.isToday &&
      this.metadataFacade.currentCurrency === this.record.currency &&
      predefinedCurrenciesDictionary[this.record.currency].id ===
        this.metadataFacade.currentCurrency
    );
  }

  constructor(
    private readonly confirmationModalService: ConfirmationModalService,
    private readonly activityLogFacade: ActivityLogFacadeService,
    private readonly actionListener: ActionListenerService,
    private readonly snackbarHandler: SnackbarHandlerService,
    private readonly metadataFacade: MetadataFacadeService
  ) {}

  removeHandler(): void {
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
      async () => {
        try {
          this.activityLogFacade.removeRecord(this.record.id);

          await this.actionListener.waitForResult(
            ActivityLogActions.recordRemoved,
            ActivityLogActions.removeRecordFail,
            (action) => action.recordId === this.record.id,
            (action) => action.recordId === this.record.id
          );

          this.snackbarHandler.showActivityLogRecordRemovedSnackbar();
        } catch {
          this.snackbarHandler.showGeneralErrorSnackbar();
        }
      }
    );
  }
}
