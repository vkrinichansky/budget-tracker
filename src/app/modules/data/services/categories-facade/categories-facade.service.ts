import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, firstValueFrom, map } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { CategoriesActions, CategoriesSelectors } from '../../store';
import { RootValuesFacadeService } from '../root-values-facade/root-values-facade.service';
import {
  Category,
  CategoryManagementRecord,
  CategoryManagementActionType,
  ActivityLogRecordType,
  BudgetType,
  CategoryValueChangeRecord,
  CategoriesResetRecord,
} from '../../models';

@Injectable()
export class CategoriesFacadeService {
  constructor(private store: Store, private rootValuesFacade: RootValuesFacadeService) {}

  getIncomeCategories(): Observable<Category[]> {
    return this.store.select(CategoriesSelectors.incomeCategoriesSelector);
  }

  getExpenseCategories(): Observable<Category[]> {
    return this.store.select(CategoriesSelectors.expenseCategoriesSelector);
  }

  areIncomeCategoriesAllReset(): Observable<boolean> {
    return this.getIncomeCategories().pipe(map((categories) => categories.every((category) => category.value === 0)));
  }

  areExpenseCategoriesAllReset(): Observable<boolean> {
    return this.getExpenseCategories().pipe(map((categories) => categories.every((category) => category.value === 0)));
  }

  getCategoryById(categoryId: string): Observable<Category> {
    return this.store.select(CategoriesSelectors.selectCategoryByIdSelector(categoryId));
  }

  getIncomeValue(): Observable<number> {
    return this.store.select(CategoriesSelectors.incomeValueSelector);
  }

  getExpenseValue(): Observable<number> {
    return this.store.select(CategoriesSelectors.expenseValueSelector);
  }

  // CATEGORY MANAGEMENT
  addCategory(category: Category): void {
    const addCategoryRecord: CategoryManagementRecord = {
      id: uuid(),
      actionType: CategoryManagementActionType.Add,
      budgetType: category.budgetType,
      categoryName: category.name,
      date: new Date().getTime(),
      icon: category.icon,
      recordType: ActivityLogRecordType.CategoryManagement,
    };

    this.store.dispatch(CategoriesActions.addCategory({ category, activityLogRecord: addCategoryRecord }));
  }

  async removeCategory(categoryId: string): Promise<void> {
    const category: Category = await firstValueFrom(this.getCategoryById(categoryId));

    const removeCategoryRecord: CategoryManagementRecord = {
      id: uuid(),
      actionType: CategoryManagementActionType.Remove,
      budgetType: category.budgetType,
      categoryName: category.name,
      date: new Date().getTime(),
      icon: category.icon,
      recordType: ActivityLogRecordType.CategoryManagement,
    };

    this.store.dispatch(CategoriesActions.removeCategory({ category, activityLogRecord: removeCategoryRecord }));
  }

  async changeCategoryValue(categoryId: string, valueToAdd = 0, note = '', isReset = false): Promise<void> {
    const balance = await firstValueFrom(this.rootValuesFacade.getFullBalanceValue());

    let newBalanceValue = balance;

    const category: Category = await firstValueFrom(this.getCategoryById(categoryId));
    const updatedCategory: Category = { ...category, value: isReset ? 0 : category.value + valueToAdd };

    let updatedCategories: Category[];

    switch (category.budgetType) {
      case BudgetType.Income:
        updatedCategories = await firstValueFrom(this.getIncomeCategories());

        if (!isReset) {
          newBalanceValue = balance + valueToAdd;
        }
        break;

      case BudgetType.Expense:
        updatedCategories = await firstValueFrom(this.getExpenseCategories());

        if (!isReset) {
          newBalanceValue = balance - valueToAdd;
        }
        break;
    }

    const updatedCategoryIndex = updatedCategories.findIndex((category) => category.id === categoryId);
    updatedCategories[updatedCategoryIndex].value = updatedCategory.value;

    const addCategoryValueRecord: CategoryValueChangeRecord = {
      id: uuid(),
      budgetType: category.budgetType,
      categoryName: category.name,
      date: new Date().getTime(),
      icon: category.icon,
      recordType: ActivityLogRecordType.CategoryValueChange,
      value: isReset ? category.value : valueToAdd,
      note,
      isReset,
    };

    this.store.dispatch(
      CategoriesActions.changeCategoryValue({
        updatedCategory,
        updatedCategories: updatedCategories,
        newBalanceValue,
        activityLogRecord: addCategoryValueRecord,
      })
    );
  }

  async resetCategoriesByType(budgetType: BudgetType): Promise<void> {
    let categories: Category[];
    let icon: string;

    switch (budgetType) {
      case BudgetType.Income:
        categories = await firstValueFrom(this.getIncomeCategories());
        icon = 'arrow-up';
        break;

      case BudgetType.Expense:
        categories = await firstValueFrom(this.getExpenseCategories());
        icon = 'arrow-down';

        break;
    }

    const updatedCategories = [
      ...categories.map((category) => {
        category.value = 0;
        return category;
      }),
    ];

    const activityLogRecord: CategoriesResetRecord = {
      budgetType: budgetType,
      date: new Date().getTime(),
      id: uuid(),
      recordType: ActivityLogRecordType.CategoriesReset,
      icon,
    };

    this.store.dispatch(CategoriesActions.resetCategories({ updatedCategories, activityLogRecord }));
  }

  // CATEGORY MANAGEMENT STATES
  getCategoryManagementInProgress(): Observable<boolean> {
    return this.store.select(CategoriesSelectors.categoryManagementInProgressSelector);
  }

  getCategoryManagementSuccess(): Observable<boolean> {
    return this.store.select(CategoriesSelectors.categoryManagementSuccessSelector);
  }

  getCategoryManagementError(): Observable<boolean> {
    return this.store.select(CategoriesSelectors.categoryManagementErrorSelector);
  }

  // CATEGORY VALUE CHANGE STATES
  getCategoryValueChangeInProgress(): Observable<boolean> {
    return this.store.select(CategoriesSelectors.categoryValueChangeInProgressSelector);
  }

  getCategoryValueChangeSuccess(): Observable<boolean> {
    return this.store.select(CategoriesSelectors.categoryValueChangeSuccessSelector);
  }

  getCategoryValueChangeError(): Observable<boolean> {
    return this.store.select(CategoriesSelectors.categoryValueChangeErrorSelector);
  }
}
