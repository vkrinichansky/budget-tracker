import { Injectable } from '@angular/core';
import { AuthFacadeService } from '@budget-tracker/auth';
import { Store } from '@ngrx/store';
import { combineLatest, firstValueFrom, map, Observable } from 'rxjs';
import { BudgetTrackerActions, BudgetTrackerSelectors } from '../../../store';
import {
  ActivityLog,
  ActivityLogGroupedByDays,
  ActivityLogGroupedByDaysInObject,
  ActivityLogRecordType,
  BudgetType,
  Category,
  CategoryManagementActionType,
  CategoryManagementRecord,
  CategoryValueChangeRecord,
  RootValueActionType,
  RootValueChangeRecord,
  RootValueType,
} from '@budget-tracker/shared';
import { v4 as uuid } from 'uuid';

@Injectable()
export class BudgetTrackerFacadeService {
  constructor(private store: Store, private authFacade: AuthFacadeService) {}

  initData(): void {
    this.authFacade.initAuthState();
    this.store.dispatch(BudgetTrackerActions.init());
  }

  isDataLoading(): Observable<boolean> {
    return this.store.select(BudgetTrackerSelectors.dataLoadingSelector);
  }

  getIncomeCategories(): Observable<Category[]> {
    return this.store.select(BudgetTrackerSelectors.incomeCategoriesSelector);
  }

  getExpenseCategories(): Observable<Category[]> {
    return this.store.select(BudgetTrackerSelectors.expenseCategoriesSelector);
  }

  getCategoryById(categoryId: string): Observable<Category> {
    return this.store.select(BudgetTrackerSelectors.selectCategoryByIdSelector(categoryId));
  }

  getIncomeValue(): Observable<number> {
    return this.store.select(BudgetTrackerSelectors.incomeValueSelector);
  }

  getExpenseValue(): Observable<number> {
    return this.store.select(BudgetTrackerSelectors.expenseValueSelector);
  }

  getFullBalanceValue(): Observable<number> {
    return this.store.select(BudgetTrackerSelectors.fullBalanceSelector);
  }

  getCurrentBalanceValue(): Observable<number> {
    return this.store.select(BudgetTrackerSelectors.currentBalanceSelector);
  }

  getSavingsValue(): Observable<number> {
    return this.store.select(BudgetTrackerSelectors.savingsSelector);
  }

  getFreeMoneyValue(): Observable<number> {
    return this.store.select(BudgetTrackerSelectors.freeMoneySelector);
  }

  // BALANCE
  async increaseBalance(value: number, note: string): Promise<void> {
    const balance = await firstValueFrom(this.getFullBalanceValue());
    const newBalanceValue = balance + value;

    const balanceIncreaseRecord: RootValueChangeRecord = {
      recordType: ActivityLogRecordType.RootValueChange,
      valueType: RootValueType.Balance,
      actionType: RootValueActionType.Increase,
      value,
      date: new Date().getTime(),
      icon: 'equal-sign',
      id: uuid(),
      note,
    };

    this.store.dispatch(
      BudgetTrackerActions.updateBalance({ newBalanceValue, activityLogRecord: balanceIncreaseRecord })
    );
  }

  async decreaseBalance(value: number, note: string): Promise<void> {
    const balance = await firstValueFrom(this.getFullBalanceValue());
    const newBalanceValue = balance - value;

    const balanceDecreaseRecord: RootValueChangeRecord = {
      recordType: ActivityLogRecordType.RootValueChange,
      valueType: RootValueType.Balance,
      actionType: RootValueActionType.Decrease,
      value,
      date: new Date().getTime(),
      icon: 'equal-sign',
      id: uuid(),
      note,
    };

    this.store.dispatch(
      BudgetTrackerActions.updateBalance({ newBalanceValue, activityLogRecord: balanceDecreaseRecord })
    );
  }

  async editBalance(newBalanceValue: number, note: string): Promise<void> {
    const balance = await firstValueFrom(this.getFullBalanceValue());

    const balanceEditRecord: RootValueChangeRecord = {
      recordType: ActivityLogRecordType.RootValueChange,
      valueType: RootValueType.Balance,
      actionType: RootValueActionType.Edit,
      oldValue: balance,
      newValue: newBalanceValue,
      date: new Date().getTime(),
      icon: 'equal-sign',
      id: uuid(),
      note,
    };

    this.store.dispatch(BudgetTrackerActions.updateBalance({ newBalanceValue, activityLogRecord: balanceEditRecord }));
  }

  // SAVINGS
  async increaseSavings(value: number, note: string): Promise<void> {
    const savings = await firstValueFrom(this.getSavingsValue());
    const newSavingsValue = savings + value;

    const savingsIncreaseRecord: RootValueChangeRecord = {
      recordType: ActivityLogRecordType.RootValueChange,
      valueType: RootValueType.Savings,
      actionType: RootValueActionType.Increase,
      value,
      date: new Date().getTime(),
      icon: 'jar',
      id: uuid(),
      note,
    };

    this.store.dispatch(
      BudgetTrackerActions.updateSavings({ newSavingsValue, activityLogRecord: savingsIncreaseRecord })
    );
  }

  async decreaseSavings(value: number, note: string): Promise<void> {
    const savings = await firstValueFrom(this.getSavingsValue());
    const newSavingsValue = savings - value;

    const savingsDecreaseRecord: RootValueChangeRecord = {
      recordType: ActivityLogRecordType.RootValueChange,
      valueType: RootValueType.Savings,
      actionType: RootValueActionType.Decrease,
      value,
      date: new Date().getTime(),
      icon: 'jar',
      id: uuid(),
      note,
    };

    this.store.dispatch(
      BudgetTrackerActions.updateSavings({ newSavingsValue, activityLogRecord: savingsDecreaseRecord })
    );
  }

  async editSavings(newSavingsValue: number, note: string): Promise<void> {
    const savings = await firstValueFrom(this.getSavingsValue());

    const savingsEditRecord: RootValueChangeRecord = {
      recordType: ActivityLogRecordType.RootValueChange,
      valueType: RootValueType.Savings,
      actionType: RootValueActionType.Edit,
      oldValue: savings,
      newValue: newSavingsValue,
      date: new Date().getTime(),
      icon: 'jar',
      id: uuid(),
      note,
    };

    this.store.dispatch(BudgetTrackerActions.updateSavings({ newSavingsValue, activityLogRecord: savingsEditRecord }));
  }

  // FREE MONEY
  async increaseFreeMoney(value: number, note: string): Promise<void> {
    const freeMoney = await firstValueFrom(this.getFreeMoneyValue());
    const newFreeMoneyValue = freeMoney + value;

    const freeMoneyIncreaseRecord: RootValueChangeRecord = {
      recordType: ActivityLogRecordType.RootValueChange,
      valueType: RootValueType.FreeMoney,
      actionType: RootValueActionType.Increase,
      value,
      date: new Date().getTime(),
      icon: 'coins',
      id: uuid(),
      note,
    };

    this.store.dispatch(
      BudgetTrackerActions.updateFreeMoney({ newFreeMoneyValue, activityLogRecord: freeMoneyIncreaseRecord })
    );
  }

  async decreaseFreeMoney(value: number, note: string): Promise<void> {
    const freeMoney = await firstValueFrom(this.getFreeMoneyValue());
    const newFreeMoneyValue = freeMoney - value;

    const freeMoneyDecreaseRecord: RootValueChangeRecord = {
      recordType: ActivityLogRecordType.RootValueChange,
      valueType: RootValueType.FreeMoney,
      actionType: RootValueActionType.Decrease,
      value,
      date: new Date().getTime(),
      icon: 'coins',
      id: uuid(),
      note,
    };

    this.store.dispatch(
      BudgetTrackerActions.updateFreeMoney({ newFreeMoneyValue, activityLogRecord: freeMoneyDecreaseRecord })
    );
  }

  async editFreeMoney(newFreeMoneyValue: number, note: string): Promise<void> {
    const freeMoney = await firstValueFrom(this.getFreeMoneyValue());

    const freeMoneyEditRecord: RootValueChangeRecord = {
      recordType: ActivityLogRecordType.RootValueChange,
      valueType: RootValueType.FreeMoney,
      actionType: RootValueActionType.Edit,
      oldValue: freeMoney,
      newValue: newFreeMoneyValue,
      date: new Date().getTime(),
      icon: 'coins',
      id: uuid(),
      note,
    };

    this.store.dispatch(
      BudgetTrackerActions.updateFreeMoney({ newFreeMoneyValue, activityLogRecord: freeMoneyEditRecord })
    );
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

    this.store.dispatch(BudgetTrackerActions.addCategory({ category, activityLogRecord: addCategoryRecord }));
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

    this.store.dispatch(BudgetTrackerActions.removeCategory({ category, activityLogRecord: removeCategoryRecord }));
  }

  async changeCategoryValue(categoryId: string, valueToAdd = 0, note = '', isReset = false): Promise<void> {
    const balance = await firstValueFrom(this.getFullBalanceValue());
    let newBalanceValue = balance;

    const category: Category = await firstValueFrom(this.getCategoryById(categoryId));
    const updatedCategory: Category = { ...category, value: isReset ? 0 : category.value + valueToAdd };

    let updatedCategoriesArray: Category[];

    switch (category.budgetType) {
      case BudgetType.Income:
        updatedCategoriesArray = await firstValueFrom(this.getIncomeCategories());

        if (!isReset) {
          newBalanceValue = balance + valueToAdd;
        }
        break;

      case BudgetType.Expense:
        updatedCategoriesArray = await firstValueFrom(this.getExpenseCategories());

        if (!isReset) {
          newBalanceValue = balance - valueToAdd;
        }
        break;
    }

    const updatedCategoryIndex = updatedCategoriesArray.findIndex((category) => category.id === categoryId);
    updatedCategoriesArray[updatedCategoryIndex].value = updatedCategory.value;

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
      BudgetTrackerActions.changeCategoryValue({
        updatedCategory,
        updatedCategoriesArray,
        newBalanceValue,
        activityLogRecord: addCategoryValueRecord,
      })
    );
  }

  // VALUE UPDATING STATES
  getValueUpdatingInProgress(): Observable<boolean> {
    return this.store.select(BudgetTrackerSelectors.valueUpdatingInProgressSelector);
  }

  getValueUpdatingSuccess(): Observable<boolean> {
    return this.store.select(BudgetTrackerSelectors.valueUpdatingSuccessSelector);
  }

  getValueUpdatingError(): Observable<boolean> {
    return this.store.select(BudgetTrackerSelectors.valueUpdatingErrorSelector);
  }

  // CATEGORY MANAGEMENT STATES
  getCategoryManagementInProgress(): Observable<boolean> {
    return this.store.select(BudgetTrackerSelectors.categoryManagementInProgressSelector);
  }

  getCategoryManagementSuccess(): Observable<boolean> {
    return this.store.select(BudgetTrackerSelectors.categoryManagementSuccessSelector);
  }

  getCategoryManagementError(): Observable<boolean> {
    return this.store.select(BudgetTrackerSelectors.categoryManagementErrorSelector);
  }

  // CATEGORY MANAGEMENT STATES
  getCategoryValueChangeInProgress(): Observable<boolean> {
    return this.store.select(BudgetTrackerSelectors.categoryValueChangeInProgressSelector);
  }

  getCategoryValueChangeSuccess(): Observable<boolean> {
    return this.store.select(BudgetTrackerSelectors.categoryValueChangeSuccessSelector);
  }

  getCategoryValueChangeError(): Observable<boolean> {
    return this.store.select(BudgetTrackerSelectors.categoryValueChangeErrorSelector);
  }

  // ACTIVITY LOG
  getActivityLogGroupedByDays(): Observable<ActivityLogGroupedByDays[]> {
    return this.store.select(BudgetTrackerSelectors.activityLogSelector).pipe(
      map((activityLog) => this.groupActivityLogByDaysInObject(activityLog)),
      map((activityLogInObject) => this.activityLogByDaysInObjectToArray(activityLogInObject))
    );
  }

  private groupActivityLogByDaysInObject(activityLog: ActivityLog): ActivityLogGroupedByDaysInObject {
    return activityLog
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .reduce((group, record) => {
        const date = new Date(record.date);
        const dateKey = date.toLocaleDateString('en', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });

        group[dateKey] = group[dateKey] ?? [];
        group[dateKey].push(record);
        return group;
      }, {} as ActivityLogGroupedByDaysInObject);
  }

  private activityLogByDaysInObjectToArray(
    activityLogInObject: ActivityLogGroupedByDaysInObject
  ): ActivityLogGroupedByDays[] {
    return Object.keys(activityLogInObject).map(
      (key) =>
        ({
          date: key,
          records: activityLogInObject[key].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        } as ActivityLogGroupedByDays)
    );
  }
}
