import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, firstValueFrom } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { AccountsSelectors, CategoriesActions, CategoriesSelectors } from '../../store';
import {
  Category,
  ActivityLogRecordType,
  BudgetType,
  CategoryValueChangeRecord,
  CategoriesResetRecord,
  Account,
} from '@budget-tracker/models';
import { Dictionary } from '@ngrx/entity';

@Injectable()
export class CategoriesFacadeService {
  constructor(private store: Store) {}

  getAllCategories(): Observable<Category[]> {
    return this.store.select(CategoriesSelectors.allCategoriesSelector);
  }

  getAllCategoriesDictionary(): Observable<Dictionary<Category>> {
    return this.store.select(CategoriesSelectors.allCategoriesDictionarySelector);
  }

  getCategoriesByType(budgetType: BudgetType): Observable<Category[]> {
    return this.store.select(CategoriesSelectors.categoriesByTypeSelector(budgetType));
  }

  areCategoriesAllReset(budgetType: BudgetType): Observable<boolean> {
    return this.store.select(CategoriesSelectors.areCategoriesAllResetSelector(budgetType));
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

  getAccountById(accountId: string): Observable<Account> {
    return this.store.select(AccountsSelectors.accountByIdSelector(accountId));
  }

  addCategory(category: Category): void {
    this.store.dispatch(CategoriesActions.addCategory({ category }));
  }

  removeCategory(categoryId: string): void {
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
    const account = structuredClone(await firstValueFrom(this.getAccountById(accountId)));
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
    const categories: Category[] = await firstValueFrom(this.getCategoriesByType(budgetType));

    let icon: string;

    switch (budgetType) {
      case BudgetType.Income:
        icon = 'arrow-up';
        break;

      case BudgetType.Expense:
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
}
