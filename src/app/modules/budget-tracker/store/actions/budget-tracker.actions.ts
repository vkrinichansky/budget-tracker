import { BudgetTrackerState, Category, CategoryManagementRecord, RootValueChangeRecord } from '@budget-tracker/shared';
import { createAction, props } from '@ngrx/store';

enum BudgetTrackerActionsType {
  Init = '[Budget Tracker] Init',
  DataLoaded = '[Budget Tracker] Data loaded',
  CleanState = '[Budget Tracker] Clean state',

  UpdateBalance = '[Budget Tracker] Update balance',
  BalanceUpdated = '[Budget Tracker] Balance updated',
  BalanceUpdateFail = '[Budget Tracker] Balance update fail',

  UpdateSavings = '[Budget Tracker] Update savings',
  SavingsUpdated = '[Budget Tracker] Savings updated',
  SavingsUpdateFail = '[Budget Tracker] Savings update fail',

  UpdateFreeMoney = '[Budget Tracker] Update free money',
  FreeMoneyUpdated = '[Budget Tracker] Free money updated',
  FreeMoneyUpdateFail = '[Budget Tracker] Free money update fail',

  ResetValueUpdatingProp = '[Budget Tracker] Reset valueUpdating prop',

  AddCategory = '[Budget Tracker] Add category',
  CategoryAdded = '[Budget Tracker] Category added',
  AddCategoryFail = '[Budget Tracker] Add category fail',

  RemoveCategory = '[Budget Tracker] Remove category',
  CategoryRemoved = '[Budget Tracker] Category removed',
  RemoveCategoryFail = '[Budget Tracker] Remove category fail',

  ResetCategoryManagementProp = '[Budget Tracker] Reset categoryManagement prop',
}

export const BudgetTrackerActions = {
  init: createAction(BudgetTrackerActionsType.Init),

  clean: createAction(BudgetTrackerActionsType.CleanState),

  dataLoaded: createAction(BudgetTrackerActionsType.DataLoaded, props<{ data: BudgetTrackerState }>()),

  updateBalance: createAction(
    BudgetTrackerActionsType.UpdateBalance,
    props<{ newBalanceValue: number; activityLogRecord: RootValueChangeRecord }>()
  ),

  balanceUpdated: createAction(
    BudgetTrackerActionsType.BalanceUpdated,
    props<{ newBalanceValue: number; activityLogRecord: RootValueChangeRecord }>()
  ),

  balanceUpdateFail: createAction(BudgetTrackerActionsType.BalanceUpdateFail),

  updateSavings: createAction(
    BudgetTrackerActionsType.UpdateSavings,
    props<{ newSavingsValue: number; activityLogRecord: RootValueChangeRecord }>()
  ),

  savingsUpdated: createAction(
    BudgetTrackerActionsType.SavingsUpdated,
    props<{ newSavingsValue: number; activityLogRecord: RootValueChangeRecord }>()
  ),

  savingsUpdateFail: createAction(BudgetTrackerActionsType.SavingsUpdateFail),

  updateFreeMoney: createAction(
    BudgetTrackerActionsType.UpdateFreeMoney,
    props<{ newFreeMoneyValue: number; activityLogRecord: RootValueChangeRecord }>()
  ),

  freeMoneyUpdated: createAction(
    BudgetTrackerActionsType.FreeMoneyUpdated,
    props<{ newFreeMoneyValue: number; activityLogRecord: RootValueChangeRecord }>()
  ),

  freeMoneyUpdateFail: createAction(BudgetTrackerActionsType.FreeMoneyUpdateFail),

  resetValueUpdatingProp: createAction(BudgetTrackerActionsType.ResetValueUpdatingProp),

  addCategory: createAction(
    BudgetTrackerActionsType.AddCategory,
    props<{ category: Category; activityLogRecord: CategoryManagementRecord }>()
  ),

  categoryAdded: createAction(
    BudgetTrackerActionsType.CategoryAdded,
    props<{ category: Category; activityLogRecord: CategoryManagementRecord }>()
  ),

  addCategoryFail: createAction(BudgetTrackerActionsType.AddCategoryFail),

  removeCategory: createAction(
    BudgetTrackerActionsType.RemoveCategory,
    props<{ category: Category; activityLogRecord: CategoryManagementRecord }>()
  ),

  categoryRemoved: createAction(
    BudgetTrackerActionsType.CategoryRemoved,
    props<{ category: Category; activityLogRecord: CategoryManagementRecord }>()
  ),

  removeCategoryFail: createAction(BudgetTrackerActionsType.RemoveCategoryFail),

  resetCategoryManagementProp: createAction(BudgetTrackerActionsType.ResetCategoryManagementProp),
};
