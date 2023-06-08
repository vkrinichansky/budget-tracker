import { Component, OnInit } from '@angular/core';
import { BudgetTrackerFacadeService } from '@budget-tracker/budget-tracker';
import { ConfirmationModalService, MenuAction } from '@budget-tracker/design-system';
import { BudgetType } from '@budget-tracker/shared';
import { TranslateService } from '@ngx-translate/core';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-expense-info-card',
  templateUrl: './expense-info-card.component.html',
})
export class ExpenseInfoCardComponent implements OnInit {
  private readonly rootTranslationKey = 'dashboard.infoCards.expense';

  readonly menuActions: MenuAction[] = [
    {
      icon: 'eraser',
      text: this.translateService.instant(this.buildTranslationKey('menu.resetCategories')),
      action: () =>
        this.confirmationModalService.openConfirmationModal(
          this.buildTranslationKey('resetConfirmationMessage'),
          undefined,
          () => this.btFacade.resetCategoriesByType(BudgetType.Expense)
        ),
    },
  ];

  expense$: Observable<number>;
  shouldDisplayMenu$: Observable<boolean>;

  constructor(
    private budgetTrackerFacade: BudgetTrackerFacadeService,
    private translateService: TranslateService,
    private confirmationModalService: ConfirmationModalService,
    private btFacade: BudgetTrackerFacadeService
  ) {}

  ngOnInit(): void {
    this.expense$ = this.budgetTrackerFacade.getExpenseValue();
    this.shouldDisplayMenu$ = this.budgetTrackerFacade
      .areExpenseCategoriesAllReset()
      .pipe(map((areReset) => !areReset));
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }
}
