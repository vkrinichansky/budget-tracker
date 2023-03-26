import { BudgetTrackerState } from '@budget-tracker/shared';
import { createAction, props } from '@ngrx/store';

enum BudgetTrackerActionsType {
  Init = '[Budget Tracker] Init',
  DataLoaded = '[Budget Tracker] Data loaded',
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
}

export const BudgetTrackerActions = {
  init: createAction(BudgetTrackerActionsType.Init),

  dataLoaded: createAction(BudgetTrackerActionsType.DataLoaded, props<{ data: BudgetTrackerState }>()),

  updateBalance: createAction(BudgetTrackerActionsType.UpdateBalance, props<{ newBalanceValue: number }>()),

  balanceUpdated: createAction(BudgetTrackerActionsType.BalanceUpdated, props<{ newBalanceValue: number }>()),

  balanceUpdateFail: createAction(BudgetTrackerActionsType.BalanceUpdateFail),

  updateSavings: createAction(BudgetTrackerActionsType.UpdateSavings, props<{ newSavingsValue: number }>()),

  savingsUpdated: createAction(BudgetTrackerActionsType.SavingsUpdated, props<{ newSavingsValue: number }>()),

  savingsUpdateFail: createAction(BudgetTrackerActionsType.SavingsUpdateFail),

  updateFreeMoney: createAction(BudgetTrackerActionsType.UpdateFreeMoney, props<{ newFreeMoneyValue: number }>()),

  freeMoneyUpdated: createAction(BudgetTrackerActionsType.FreeMoneyUpdated, props<{ newFreeMoneyValue: number }>()),

  freeMoneyUpdateFail: createAction(BudgetTrackerActionsType.FreeMoneyUpdateFail),

  resetValueUpdatingProp: createAction(BudgetTrackerActionsType.ResetValueUpdatingProp),
};
