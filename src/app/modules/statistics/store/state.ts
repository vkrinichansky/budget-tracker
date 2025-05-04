import { ActionReducerMap, combineReducers, compose } from '@ngrx/store';
import * as t from './reducers';

export const featureKey = 'snapshots';

export interface DataFeatureState {
  statisticsState: t.StatisticsState;
}

export const reducers: ActionReducerMap<DataFeatureState> = {
  statisticsState: t.statisticsReducer,
};

// tslint:disable-next-line:typedef
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function store(state: any, action: any): DataFeatureState {
  // tslint:disable-next-line:no-shadowed-variable
  const store = compose(combineReducers)(reducers);
  return store(state, action);
}
