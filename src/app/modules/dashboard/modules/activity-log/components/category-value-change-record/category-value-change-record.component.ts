import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActivityLogFacadeService } from '../../../../services';
import { ConfirmationModalService, SnackbarHandlerService } from '@budget-tracker/design-system';
import { CategoryValueChangeRecord, BudgetType } from '@budget-tracker/models';
import { ActionListenerService, isToday } from '@budget-tracker/utils';
import { combineLatest, map, Observable } from 'rxjs';
import { ActivityLogActions } from '../../../../store';
import { CurrencyFacadeService } from '@budget-tracker/metadata';

@Component({
  selector: 'app-category-value-change-record',
  templateUrl: './category-value-change-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CategoryValueChangeRecordComponent implements OnInit {
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

  constructor(
    private readonly confirmationModalService: ConfirmationModalService,
    private readonly activityLogFacade: ActivityLogFacadeService,
    private readonly actionListener: ActionListenerService,
    private readonly snackbarHandler: SnackbarHandlerService,
    private readonly currencyFacade: CurrencyFacadeService
  ) {}

  ngOnInit(): void {
    this.shouldDisplayRemoveButton$ = combineLatest([
      this.activityLogFacade.doesCategoryExist(this.record.category.id),
      this.activityLogFacade.doesAccountExist(this.record.account.id),
      this.currencyFacade
        .getCurrentCurrencyObs()
        .pipe(map((currency) => currency === this.record.currency)),
    ]).pipe(map(([a, b, c]) => a && b && c && this.isToday));
  }

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
          this.activityLogFacade.removeCategoryValueChangeRecord(this.record.id);

          await this.actionListener.waitForResult(
            ActivityLogActions.activityLogRecordRemoved,
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
