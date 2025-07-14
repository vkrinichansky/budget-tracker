import { Injectable } from '@angular/core';
import { BudgetType } from '@budget-tracker/models';
import { Observable, firstValueFrom, map } from 'rxjs';
import { CategorySelectors, CategoryActions } from '../../store';
import { Store } from '@ngrx/store';
import { Category, CategoryEvents } from '../../models';
import { EventBusService } from '@budget-tracker/utils';

@Injectable()
export class CategoryService {
  constructor(
    private readonly store: Store,
    private readonly eventBus: EventBusService
  ) {}

  async initCategoryDB(): Promise<void> {
    this.store.dispatch(CategoryActions.initCategoryDB());

    return this.eventBus.waitFor(CategoryEvents.INIT_CATEGORY_DB);
  }

  async loadCategories(): Promise<void> {
    const isLoaded = await firstValueFrom(this.categoriesLoaded());

    if (!isLoaded) {
      this.store.dispatch(CategoryActions.loadCategories());
    }
  }

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

  addCategory(category: Category): void {
    this.store.dispatch(CategoryActions.addCategory({ category }));
  }

  removeCategory(categoryId: string): void {
    this.store.dispatch(
      CategoryActions.removeCategory({
        categoryId,
      })
    );
  }

  async changeCategoryValue(
    categoryId: string,
    accountId: string,
    valueToAdd: number,
    convertedValueToAdd: number,
    note: string
  ): Promise<void> {
    const category = structuredClone(await firstValueFrom(this.getCategoryById(categoryId)));

    const updatedCategoryValue = category.value + convertedValueToAdd;

    // let updatedAccountValue: number;

    // switch (category.budgetType) {
    //   case BudgetType.Income:
    //     updatedAccountValue = account.value + valueToAdd;

    //     break;

    //   case BudgetType.Expense:
    //     updatedAccountValue = account.value - valueToAdd;

    //     break;
    // }

    this.store.dispatch(
      CategoryActions.changeCategoryValue({
        updatedCategoryId: categoryId,
        updatedCategoryValue,
      })
    );
  }

  async resetCategoriesByType(budgetType: BudgetType): Promise<void> {
    const categoriesIdsToReset: string[] = await firstValueFrom(
      this.getCategoriesByType(budgetType).pipe(
        map((categories) => categories.map((category) => category.id))
      )
    );

    this.store.dispatch(CategoryActions.resetCategories({ categoriesIdsToReset, budgetType }));
  }

  updateCategories(categories: Category[]): Promise<void> {
    this.store.dispatch(CategoryActions.updateCategories({ categories }));

    return this.eventBus.waitFor(CategoryEvents.UPDATE_CATEGORIES);
  }
}
