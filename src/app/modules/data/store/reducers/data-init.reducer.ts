import { Action, createReducer, on } from '@ngrx/store';
import { DataInitActions } from '../actions';

export interface DataInitializationState {
  isDataLoading: boolean;
  isDataLoaded: boolean;
  resetDate: string;
}

const initialState: DataInitializationState = {
  isDataLoaded: false,
  isDataLoading: false,
  resetDate: null,
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
  })),

  on(DataInitActions.resetDateLoaded, (state, action) => ({
    ...state,
    resetDate: action.resetDate,
  }))
);

export function dataInitializationReducer(
  state = initialState,
  action: Action
): DataInitializationState {
  return adapterReducer(state, action);
}
