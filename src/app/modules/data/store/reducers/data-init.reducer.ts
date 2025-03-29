import { Action, createReducer, on } from '@ngrx/store';
import { DataInitActions } from '../actions';

export interface DataInitializationState {
  isDataLoaded: boolean;
  resetDate: string;
}

const initialState: DataInitializationState = {
  isDataLoaded: false,
  resetDate: null,
};

const adapterReducer = createReducer(
  initialState,

  on(DataInitActions.clean, () => initialState),

  on(DataInitActions.dataLoaded, (state) => ({
    ...state,
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
