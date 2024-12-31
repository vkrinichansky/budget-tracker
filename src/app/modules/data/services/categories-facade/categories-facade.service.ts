import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, firstValueFrom } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { ActivityLogSelectors, CategoriesActions, CategoriesSelectors } from '../../store';
import {
  Category,
  ActivityLogRecordType,
  BudgetType,
  CategoryValueChangeRecord,
  CategoriesResetRecord,
} from '../../models';
import { Dictionary } from '@ngrx/entity';
import { AccountsFacadeService } from '../accounts-facade/accounts-facade.service';

@Injectable()
export class CategoriesFacadeService {
  constructor(
    private store: Store,
    private accountsFacade: AccountsFacadeService
  ) {}

  getAllCategories(): Observable<Category[]> {
    return this.store.select(CategoriesSelectors.allCategoriesSelector);
  }

  getAllCategoriesDictionary(): Observable<Dictionary<Category>> {
    return this.store.select(CategoriesSelectors.allCategoriesDictionarySelector);
  }

  getIncomeCategories(): Observable<Category[]> {
    return this.store.select(CategoriesSelectors.incomeCategoriesSelector);
  }

  getExpenseCategories(): Observable<Category[]> {
    return this.store.select(CategoriesSelectors.expenseCategoriesSelector);
  }

  areIncomeCategoriesAllReset(): Observable<boolean> {
    return this.store.select(CategoriesSelectors.areIncomeCategoriesAllResetSelector);
  }

  areExpenseCategoriesAllReset(): Observable<boolean> {
    return this.store.select(CategoriesSelectors.areExpenseCategoriesAllResetSelector);
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

  getCurrentMonthBalance(): Observable<number> {
    return this.store.select(CategoriesSelectors.currentMonthBalanceSelector);
  }

  getCategoriesAccordingToBudgetType(budgetType: BudgetType): Observable<Category[]> {
    switch (budgetType) {
      case BudgetType.Income:
        return this.getIncomeCategories();

      case BudgetType.Expense:
        return this.getExpenseCategories();
    }
  }

  // CATEGORY MANAGEMENT
  addCategory(category: Category): void {
    this.store.dispatch(CategoriesActions.addCategory({ category }));
  }

  async removeCategory(categoryId: string): Promise<void> {
    this.store.dispatch(
      CategoriesActions.removeCategory({
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
    const account = structuredClone(
      await firstValueFrom(this.accountsFacade.getAccountById(accountId))
    );
    const category = structuredClone(await firstValueFrom(this.getCategoryById(categoryId)));

    const updatedCategoryValue = category.value + convertedValueToAdd;

    const addCategoryValueRecord: CategoryValueChangeRecord = {
      id: uuid(),
      budgetType: category.budgetType,
      category,
      account,
      date: new Date().getTime(),
      icon: category.icon,
      recordType: ActivityLogRecordType.CategoryValueChange,
      value: valueToAdd,
      convertedValue: convertedValueToAdd,
      note,
    };

    let updatedAccountValue: number;

    switch (category.budgetType) {
      case BudgetType.Income:
        updatedAccountValue = account.value + valueToAdd;

        break;

      case BudgetType.Expense:
        updatedAccountValue = account.value - valueToAdd;

        break;
    }

    this.store.dispatch(
      CategoriesActions.changeCategoryValue({
        updatedCategoryId: categoryId,
        updatedCategoryValue,
        updatedAccountId: accountId,
        updatedAccountValue,
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

    const categoriesIdsToReset = categories.map((category) => category.id);

    const activityLogRecord: CategoriesResetRecord = {
      budgetType: budgetType,
      date: new Date().getTime(),
      id: uuid(),
      recordType: ActivityLogRecordType.CategoriesReset,
      icon,
    };

    this.store.dispatch(
      CategoriesActions.resetCategories({ categoriesIdsToReset, budgetType, activityLogRecord })
    );
  }

  // CATEGORY MANAGEMENT STATES
  getCategoryManagementInProgress(): Observable<boolean> {
    return this.store.select(CategoriesSelectors.categoryManagementInProgressSelector);
  }

  getCategoryManagementSuccess(): Observable<boolean> {
    return this.store.select(CategoriesSelectors.categoryManagementSuccessSelector);
  }

  isCategoryRemoving(categoryId: string): Observable<boolean> {
    return this.store.select(CategoriesSelectors.isCategoryRemovingSelector(categoryId));
  }

  // CATEGORY VALUE CHANGE STATES
  getCategoryValueChangeInProgress(): Observable<boolean> {
    return this.store.select(CategoriesSelectors.categoryValueChangeInProgressSelector);
  }

  getCategoryValueChangeSuccess(): Observable<boolean> {
    return this.store.select(CategoriesSelectors.categoryValueChangeSuccessSelector);
  }
}
