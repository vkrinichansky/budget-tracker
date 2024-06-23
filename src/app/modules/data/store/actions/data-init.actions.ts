import { createAction, props } from '@ngrx/store';
import { BudgetTrackerState } from '../../models';

export const DataInitActions = {
  init: createAction('[Budget Tracker] Init'),
  clean: createAction('[Budget Tracker] Clean state'),
  dataLoaded: createAction('[Budget Tracker] Data loaded'),
  resetDateLoaded: createAction('[Budget Tracker] Reset date loaded', props<{ resetDate: string }>()),
  resetData: createAction('[Budget Tracker] Reset data', props<{ data: BudgetTrackerState }>()),
};
