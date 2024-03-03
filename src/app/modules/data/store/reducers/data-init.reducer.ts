import { Action, createReducer, on } from '@ngrx/store';
import { DataInitActions } from '../actions';

export interface DataInitializationState {
  isDataLoading: boolean;
  isDataLoaded: boolean;
}

const initialState: DataInitializationState = {
  isDataLoaded: false,
  isDataLoading: false,
};

const adapterReducer = createReducer(
  initialState,
  on(DataInitActions.init, (state) => ({
    ...state,
    isDataLoading: true,
  })),

  on(DataInitActions.clean, () => initialState),

  on(DataInitActions.dataLoaded, (state) => ({
    ...state,
    isDataLoading: false,
    isDataLoaded: true,
  }))
);

export function dateInitializationReducer(state = initialState, action: Action): DataInitializationState {
  return adapterReducer(state, action);
}
