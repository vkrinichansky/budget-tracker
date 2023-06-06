import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BudgetTrackerFacadeService } from '@budget-tracker/budget-tracker';
import { BudgetType, Category } from '@budget-tracker/shared';
import { Observable, map } from 'rxjs';
import { AddCategoryModalService } from '../../services';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent implements OnInit {
  private readonly rootTranslationKey = 'dashboard.categories';

  @Input()
  budgetType: BudgetType;

  isBackDisplayed = false;

  isFrontDisplayed = true;

  title: string;

  categories$: Observable<Category[]>;

  isEmpty$: Observable<boolean>;

  addButtonAction: () => void;

  constructor(private btFacade: BudgetTrackerFacadeService, private addCategoryModalService: AddCategoryModalService) {}

  ngOnInit(): void {
    switch (this.budgetType) {
      case BudgetType.Income:
        this.title = this.buildTranslationKey(`${BudgetType.Income}.title`);
        this.categories$ = this.btFacade.getIncomeCategories();
        this.addButtonAction = () => this.addCategoryModalService.openAddIncomeCategoryModal();

        break;

      case BudgetType.Expense:
        this.title = this.buildTranslationKey(`${BudgetType.Expense}.title`);
        this.categories$ = this.btFacade.getExpenseCategories();
        this.addButtonAction = () => this.addCategoryModalService.openAddExpenseCategoryModal();

        break;
    }

    this.isEmpty$ = this.categories$.pipe(map((categories) => !categories.length));
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }

  toggleSide(): void {
    if (this.isFrontDisplayed) {
      this.isFrontDisplayed = false;
      this.isBackDisplayed = true;
    } else {
      this.isFrontDisplayed = true;
      this.isBackDisplayed = false;
    }
  }
}
