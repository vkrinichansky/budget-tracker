import { createAction, props } from '@ngrx/store';
import { BudgetTrackerState } from '../../models';

enum DataInitActionsType {
  Init = '[Budget Tracker] Init',
  DataLoaded = '[Budget Tracker] Data loaded',
  CleanState = '[Budget Tracker] Clean state',
}

export const DataInitActions = {
  init: createAction(DataInitActionsType.Init),

  clean: createAction(DataInitActionsType.CleanState),

  dataLoaded: createAction(DataInitActionsType.DataLoaded, props<{ data: BudgetTrackerState }>()),
};
