import { Injectable } from '@angular/core';
import { CategoryService } from '../category-service/category.service';
import { BudgetType } from '@budget-tracker/models';
import { Observable } from 'rxjs';
import { Category } from '../../models';
import { DocumentReference } from '@angular/fire/firestore';
import { CategoryApiService } from '../category-api-service/category-api.service';

@Injectable()
export class CategoryFacadeService {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly categoryApiService: CategoryApiService
  ) {}

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
  loadCategories(): void {
    this.categoryService.loadCategories();
  }

  async addCategory(category: Category): Promise<void> {
    return this.categoryService.addCategory(category);
  }

  removeCategory(categoryId: string): Promise<void> {
    return this.categoryService.removeCategory(categoryId);
  }

  updateCategories(updatedCategories: Category[]): void {
    this.categoryService.updateCategories(updatedCategories);
  }

  async resetCategoriesByType(budgetType: BudgetType): Promise<void> {
    return this.categoryService.resetCategoriesByType(budgetType);
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

  // ===== UTILS =====
  getCategoryDocRef(): DocumentReference {
    return this.categoryApiService.getDocRef();
  }
}
