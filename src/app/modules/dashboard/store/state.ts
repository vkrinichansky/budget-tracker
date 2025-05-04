import { ActionReducerMap, combineReducers, compose } from '@ngrx/store';
import * as t from './reducers';

export const featureKey = 'dashboard';

export interface DashboardFeatureState {
  accountsState: t.AccountsState;
  categoriesState: t.CategoriesState;
  activityLogState: t.ActivityLogState;
}

export const reducers: ActionReducerMap<DashboardFeatureState> = {
  accountsState: t.accountsReducer,
  categoriesState: t.categoriesReducer,
  activityLogState: t.activityLogReducer,
};

// tslint:disable-next-line:typedef
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function store(state: any, action: any): DashboardFeatureState {
  // tslint:disable-next-line:no-shadowed-variable
  const store = compose(combineReducers)(reducers);
  return store(state, action);
}
