import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, firstValueFrom, map } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { ActivityLogSelectors, CategoriesActions, CategoriesSelectors } from '../../store';
import {
  Category,
  CategoryManagementRecord,
  EntityManagementActionType,
  ActivityLogRecordType,
  BudgetType,
  CategoryValueChangeRecord,
  CategoriesResetRecord,
  Account,
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

  getCurrentMonthBalance(): Observable<number> {
    return combineLatest([this.getIncomeValue(), this.getExpenseValue()]).pipe(
      map(([income, expense]) => income - expense)
    );
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
    const addCategoryRecord: CategoryManagementRecord = {
      id: uuid(),
      actionType: EntityManagementActionType.Add,
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

    const relatedCategoryValueChangeRecordsToRemove = await firstValueFrom(
      this.store.select(ActivityLogSelectors.activityLogSelector).pipe(
        map((activityLog) =>
          activityLog
            .filter((record) => record.recordType === ActivityLogRecordType.CategoryValueChange)
            .map((record) => record as CategoryValueChangeRecord)
            .filter((record) => record.categoryId === categoryId)
        )
      )
    );

    const removeCategoryRecord: CategoryManagementRecord = {
      id: uuid(),
      actionType: EntityManagementActionType.Remove,
      budgetType: category.budgetType,
      categoryName: category.name,
      date: new Date().getTime(),
      icon: category.icon,
      recordType: ActivityLogRecordType.CategoryManagement,
    };

    this.store.dispatch(
      CategoriesActions.removeCategory({
        category,
        activityLogRecord: removeCategoryRecord,
        recordsToRemove: relatedCategoryValueChangeRecordsToRemove,
      })
    );
  }

  isCategoryRemoving(categoryId: string): Observable<boolean> {
    return this.store
      .select(CategoriesSelectors.selectCategoriesRemovingIds)
      .pipe(map((removingCategoriesIds) => removingCategoriesIds.includes(categoryId)));
  }

  async changeCategoryValue(categoryId: string, accountId: string, valueToAdd = 0, note = ''): Promise<void> {
    const account = structuredClone(await firstValueFrom(this.accountsFacade.getAccountById(accountId)));
    const category = structuredClone(await firstValueFrom(this.getCategoryById(categoryId)));

    const updatedCategory: Category = {
      ...category,
      value: category.value + valueToAdd,
    };

    const addCategoryValueRecord: CategoryValueChangeRecord = {
      id: uuid(),
      budgetType: category.budgetType,
      categoryId: category.id,
      categoryName: category.name,
      accountId,
      accountName: account.name,
      date: new Date().getTime(),
      icon: category.icon,
      recordType: ActivityLogRecordType.CategoryValueChange,
      value: valueToAdd,
      note,
    };

    let updatedAccount: Account;

    switch (category.budgetType) {
      case BudgetType.Income:
        updatedAccount = {
          ...account,
          value: account.value + valueToAdd,
        };

        break;

      case BudgetType.Expense:
        updatedAccount = {
          ...account,
          value: account.value - valueToAdd,
        };

        break;
    }

    this.store.dispatch(
      CategoriesActions.changeCategoryValue({
        updatedCategory,
        updatedAccount,
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
