import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BudgetType, CategoriesFacadeService } from '@budget-tracker/data';
import { ConfirmationModalService, MenuAction } from '@budget-tracker/design-system';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-income-info-card',
  templateUrl: './income-info-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeInfoCardComponent implements OnInit {
  private readonly rootTranslationKey = 'dashboard.infoCards.income';

  readonly menuActions: MenuAction[] = [
    {
      icon: 'eraser',
      translationKey: this.buildTranslationKey('menu.resetCategories'),
      action: () =>
        this.confirmationModalService.openConfirmationModal(
          this.buildTranslationKey('resetConfirmationMessage'),
          undefined,
          () => this.categoriesFacade.resetCategoriesByType(BudgetType.Income)
        ),
    },
  ];

  income$: Observable<number>;
  shouldDisplayMenu$: Observable<boolean>;

  constructor(
    private confirmationModalService: ConfirmationModalService,
    private categoriesFacade: CategoriesFacadeService
  ) {}

  ngOnInit(): void {
    this.income$ = this.categoriesFacade.getIncomeValue();
    this.shouldDisplayMenu$ = this.categoriesFacade.areIncomeCategoriesAllReset().pipe(map((areReset) => !areReset));
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }
}
