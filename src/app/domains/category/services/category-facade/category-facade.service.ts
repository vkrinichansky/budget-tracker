import { Injectable } from '@angular/core';
import { CategoryService } from '../category-service/category.service';
import { BudgetType } from '@budget-tracker/models';
import { Observable } from 'rxjs';
import { Category } from '../../models';

@Injectable()
export class CategoryFacadeService {
  constructor(private readonly categoryService: CategoryService) {}

  initCategoryDB(): Promise<void> {
    return this.categoryService.initCategoryDB();
  }

  loadCategories(): void {
    this.categoryService.loadCategories();
  }

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

  addCategory(category: Category): void {
    this.categoryService.addCategory(category);
  }

  removeCategory(categoryId: string): void {
    this.categoryService.removeCategory(categoryId);
  }

  changeCategoryValue(
    categoryId: string,
    accountId: string,
    valueToAdd: number,
    convertedValueToAdd: number,
    note: string
  ): void {
    this.categoryService.changeCategoryValue(
      categoryId,
      accountId,
      valueToAdd,
      convertedValueToAdd,
      note
    );
  }

  resetCategoriesByType(budgetType: BudgetType): void {
    this.categoryService.resetCategoriesByType(budgetType);
  }

  areCategoriesAllReset(budgetType: BudgetType): Observable<boolean> {
    return this.categoryService.areCategoriesAllReset(budgetType);
  }

  getCategoriesByType(budgetType: BudgetType): Observable<Category[]> {
    return this.categoryService.getCategoriesByType(budgetType);
  }
}
