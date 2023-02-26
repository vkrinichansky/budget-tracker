import { BudgetTrackerState } from '@budget-tracker/shared';
import { createAction, props } from '@ngrx/store';

enum BudgetTrackerActionsType {
  Init = '[Budget Tracker] Init',
  DataLoaded = '[Budget Tracker] Data loaded',
}

export const BudgetTrackerActions = {
  init: createAction(BudgetTrackerActionsType.Init),
  dataLoaded: createAction(BudgetTrackerActionsType.DataLoaded, props<{ data: BudgetTrackerState }>()),
};
