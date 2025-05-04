import { ActionReducerMap, combineReducers, compose } from '@ngrx/store';
import * as t from './reducers';

export const featureKey = 'metadata';

export interface MetadataFeatureState {
  metadataState: t.MetadataState;
}

export const reducers: ActionReducerMap<MetadataFeatureState> = {
  metadataState: t.metadataReducer,
};

// tslint:disable-next-line:typedef
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function store(state: any, action: any): MetadataFeatureState {
  // tslint:disable-next-line:no-shadowed-variable
  const store = compose(combineReducers)(reducers);
  return store(state, action);
}
