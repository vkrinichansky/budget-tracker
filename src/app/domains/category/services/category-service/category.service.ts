import { Injectable } from '@angular/core';
import { BudgetType } from '@budget-tracker/shared-models';
import { Observable, firstValueFrom } from 'rxjs';
import { CategorySelectors } from '../../store/category.selectors';
import { CategoryActions } from '../../store/category.actions';
import { Store } from '@ngrx/store';
import { Category, CategoryEvents, ResetCategoriesEvent } from '../../models';
import { EventBusService } from '@budget-tracker/shared-utils';

@Injectable()
export class CategoryService {
  constructor(
    private readonly store: Store,
    private readonly eventBus: EventBusService
  ) {}

  // ===== SELECTORS =====
  categoriesLoaded(): Observable<boolean> {
    return this.store.select(CategorySelectors.categoriesLoadedSelector);
  }

  getAllCategories(): Observable<Category[]> {
    return this.store.select(CategorySelectors.allCategoriesSelector);
  }

  getCategoriesByType(budgetType: BudgetType): Observable<Category[]> {
    return this.store.select(CategorySelectors.categoriesByTypeSelector(budgetType));
  }

  areCategoriesAllReset(budgetType: BudgetType): Observable<boolean> {
    return this.store.select(CategorySelectors.areCategoriesAllResetSelector(budgetType));
  }

  getCategoryById(categoryId: string): Observable<Category> {
    return this.store.select(CategorySelectors.selectCategoryByIdSelector(categoryId));
  }

  getIncomeValue(): Observable<number> {
    return this.store.select(CategorySelectors.incomeValueSelector);
  }

  getExpenseValue(): Observable<number> {
    return this.store.select(CategorySelectors.expenseValueSelector);
  }

  getCurrentMonthBalance(): Observable<number> {
    return this.store.select(CategorySelectors.currentMonthBalanceSelector);
  }

  // ===== ACTIONS =====
  async loadCategories(): Promise<void> {
    const isLoaded = await firstValueFrom(this.categoriesLoaded());

    if (!isLoaded) {
      this.store.dispatch(CategoryActions.loadCategories());
    }
  }

  async addCategory(category: Category): Promise<void> {
    this.store.dispatch(CategoryActions.addCategory({ category }));

    return this.eventBus.waitFor(CategoryEvents.CREATE_CATEGORY);
  }

  async removeCategory(categoryId: string): Promise<void> {
    this.store.dispatch(
      CategoryActions.removeCategory({
        categoryId,
      })
    );

    return this.eventBus.waitFor(CategoryEvents.REMOVE_CATEGORY, categoryId);
  }

  updateCategories(updatedCategories: Category[]): void {
    this.store.dispatch(
      CategoryActions.categoriesUpdated({
        updatedCategories,
      })
    );
  }

  // ===== FLOW TRIGGERS =====
  async runResetCategoriesFlow(budgetType: BudgetType): Promise<void> {
    this.eventBus.emit<ResetCategoriesEvent>({
      type: CategoryEvents.RESET_CATEGORIES_START,
      status: 'event',
      payload: {
        budgetType,
      },
    });

    return this.eventBus.waitFor(CategoryEvents.RESET_CATEGORIES_FINISH);
  }
}
