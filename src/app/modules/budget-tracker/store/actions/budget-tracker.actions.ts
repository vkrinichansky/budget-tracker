import { BudgetTrackerState } from '@budget-tracker/shared';
import { createAction, props } from '@ngrx/store';

enum BudgetTrackerActionsType {
  Init = '[Budget Tracker] Init',
  DataLoaded = '[Budget Tracker] Data loaded',
  CleanState = '[Budget Tracker] Clean state',
}

export const BudgetTrackerActions = {
  init: createAction(BudgetTrackerActionsType.Init),

  clean: createAction(BudgetTrackerActionsType.CleanState),

  dataLoaded: createAction(BudgetTrackerActionsType.DataLoaded, props<{ data: BudgetTrackerState }>()),
};
