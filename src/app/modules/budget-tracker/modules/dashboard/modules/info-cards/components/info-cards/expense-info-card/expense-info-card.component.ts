import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BudgetType, CategoriesFacadeService } from '@budget-tracker/data';
import { ConfirmationModalService, MenuAction } from '@budget-tracker/design-system';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-expense-info-card',
  templateUrl: './expense-info-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseInfoCardComponent implements OnInit {
  private readonly rootTranslationKey = 'dashboard.infoCards.expense';

  readonly menuActions: MenuAction[] = [
    {
      icon: 'eraser',
      translationKey: this.buildTranslationKey('menu.resetCategories'),
      action: () =>
        this.confirmationModalService.openConfirmationModal(
          this.buildTranslationKey('resetConfirmationMessage'),
          undefined,
          () => this.categoriesFacade.resetCategoriesByType(BudgetType.Expense)
        ),
    },
  ];

  expense$: Observable<number>;
  shouldDisplayMenu$: Observable<boolean>;

  constructor(
    private confirmationModalService: ConfirmationModalService,
    private categoriesFacade: CategoriesFacadeService
  ) {}

  ngOnInit(): void {
    this.expense$ = this.categoriesFacade.getExpenseValue();
    this.shouldDisplayMenu$ = this.categoriesFacade.areExpenseCategoriesAllReset().pipe(map((areReset) => !areReset));
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }
}
