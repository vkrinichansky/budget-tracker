import { Dashboard } from '@budget-tracker/models';
import { createAction, props } from '@ngrx/store';

export const DashboardInitActions = {
  init: createAction('[Dashboard init] Init'),
  dataLoaded: createAction('[Dashboard init] Data loaded'),
  resetData: createAction('[Dashboard init] Reset data', props<{ data: Dashboard }>()),
};
