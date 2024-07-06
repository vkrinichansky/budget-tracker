import { ActionReducerMap, combineReducers, compose } from '@ngrx/store';
import * as t from './reducers';

export const featureKey = 'data';

export interface DataFeatureState {
  dataInitState: t.DataInitializationState;
  activityLogState: t.ActivityLogState;
  categoriesState: t.CategoriesState;
  statisticsState: t.StatisticsState;
  accountsState: t.AccountsState;
  metadataState: t.MetadataState;
}

export const reducers: ActionReducerMap<DataFeatureState> = {
  activityLogState: t.activityLogReducer,
  categoriesState: t.categoriesReducer,
  dataInitState: t.dataInitializationReducer,
  statisticsState: t.statisticsReducer,
  accountsState: t.accountsReducer,
  metadataState: t.metadataReducer,
};

// tslint:disable-next-line:typedef
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function store(state: any, action: any): DataFeatureState {
  // tslint:disable-next-line:no-shadowed-variable
  const store = compose(combineReducers)(reducers);
  return store(state, action);
}
