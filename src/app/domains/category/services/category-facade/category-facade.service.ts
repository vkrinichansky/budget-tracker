import { Injectable } from '@angular/core';
import { CategoryService } from '../category-service/category.service';
import { BudgetType } from '@budget-tracker/models';
import { Observable } from 'rxjs';
import { Category } from '../../models';

@Injectable()
export class CategoryFacadeService {
  constructor(private readonly categoryService: CategoryService) {}

  // ===== SELECTORS =====
  categoriesLoaded(): Observable<boolean> {
    return this.categoryService.categoriesLoaded();
  }

  getAllCategories(): Observable<Category[]> {
    return this.categoryService.getAllCategories();
  }

  getIncomeValue(): Observable<number> {
    return this.categoryService.getIncomeValue();
  }

  getExpenseValue(): Observable<number> {
    return this.categoryService.getExpenseValue();
  }

  getCurrentMonthBalance(): Observable<number> {
    return this.categoryService.getCurrentMonthBalance();
  }

  getCategoryById(categoryId: string): Observable<Category> {
    return this.categoryService.getCategoryById(categoryId);
  }

  areCategoriesAllReset(budgetType: BudgetType): Observable<boolean> {
    return this.categoryService.areCategoriesAllReset(budgetType);
  }

  getCategoriesByType(budgetType: BudgetType): Observable<Category[]> {
    return this.categoryService.getCategoriesByType(budgetType);
  }

  // ===== ACTIONS =====
  initCategoryDB(): Promise<void> {
    return this.categoryService.initCategoryDB();
  }

  loadCategories(): void {
    this.categoryService.loadCategories();
  }

  async addCategory(category: Category): Promise<void> {
    return this.categoryService.addCategory(category);
  }

  removeCategory(categoryId: string): Promise<void> {
    return this.categoryService.removeCategory(categoryId);
  }

  async changeCategoryValue(
    categoryId: string,
    convertedValueToAdd: number,
    rewrite: boolean = false
  ): Promise<void> {
    return this.categoryService.changeCategoryValue(categoryId, convertedValueToAdd, rewrite);
  }

  async resetCategoriesByType(budgetType: BudgetType): Promise<void> {
    return this.categoryService.resetCategoriesByType(budgetType);
  }

  updateCategories(categories: Category[]): Promise<void> {
    return this.categoryService.updateCategories(categories);
  }

  // ===== FLOW TRIGGERS =====
  async runResetCategoriesFlow(budgetType: BudgetType): Promise<void> {
    return this.categoryService.runResetCategoriesFlow(budgetType);
  }

  async runChangeCategoryValueFlow(
    categoryId: string,
    accountId: string,
    valueToAdd: number,
    convertedValueToAdd: number,
    note: string
  ): Promise<void> {
    return this.categoryService.runChangeCategoryValueFlow(
      categoryId,
      accountId,
      valueToAdd,
      convertedValueToAdd,
      note
    );
  }
}
