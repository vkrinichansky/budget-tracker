import { createAction, props } from '@ngrx/store';
import { RootValueChangeRecord } from '../../models';

enum RootValuesActionsType {
  RootValuesLoaded = '[Root Values] Root values loaded',

  UpdateBalance = '[Root Values] Update balance',
  BalanceUpdated = '[Root Values] Balance updated',
  BalanceUpdateFail = '[Root Values] Balance update fail',

  UpdateSavings = '[Root Values] Update savings',
  SavingsUpdated = '[Root Values] Savings updated',
  SavingsUpdateFail = '[Root Values] Savings update fail',

  UpdateFreeMoney = '[Root Values] Update free money',
  FreeMoneyUpdated = '[Root Values] Free money updated',
  FreeMoneyUpdateFail = '[Root Values] Free money update fail',

  ResetValueUpdatingProp = '[Root Values] Reset valueUpdating prop',

  Clean = '[Root Values] Clean state',
}

export const RootValuesActions = {
  updateBalance: createAction(
    RootValuesActionsType.UpdateBalance,
    props<{ newBalanceValue: number; activityLogRecord: RootValueChangeRecord }>()
  ),

  balanceUpdated: createAction(RootValuesActionsType.BalanceUpdated, props<{ newBalanceValue: number }>()),

  balanceUpdateFail: createAction(RootValuesActionsType.BalanceUpdateFail),

  updateSavings: createAction(
    RootValuesActionsType.UpdateSavings,
    props<{ newSavingsValue: number; activityLogRecord: RootValueChangeRecord }>()
  ),

  savingsUpdated: createAction(RootValuesActionsType.SavingsUpdated, props<{ newSavingsValue: number }>()),

  savingsUpdateFail: createAction(RootValuesActionsType.SavingsUpdateFail),

  updateFreeMoney: createAction(
    RootValuesActionsType.UpdateFreeMoney,
    props<{ newFreeMoneyValue: number; activityLogRecord: RootValueChangeRecord }>()
  ),

  freeMoneyUpdated: createAction(RootValuesActionsType.FreeMoneyUpdated, props<{ newFreeMoneyValue: number }>()),

  freeMoneyUpdateFail: createAction(RootValuesActionsType.FreeMoneyUpdateFail),

  resetValueUpdatingProp: createAction(RootValuesActionsType.ResetValueUpdatingProp),

  rootValuesLoaded: createAction(
    RootValuesActionsType.RootValuesLoaded,
    props<{ balance: number; savings: number; freeMoney: number }>()
  ),

  clean: createAction(RootValuesActionsType.Clean),
};
