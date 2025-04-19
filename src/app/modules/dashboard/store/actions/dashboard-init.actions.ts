import { Dashboard } from '@budget-tracker/models';
import { createAction, props } from '@ngrx/store';

export const DashboardInitActions = {
  loadDashboardData: createAction('[Dashboard init] Load dashboard data'),
  dashboardDataLoaded: createAction('[Dashboard init] Dashboard data loaded'),
  resetData: createAction('[Dashboard init] Reset data', props<{ data: Dashboard }>()),
};
