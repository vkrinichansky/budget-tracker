import { createReducer, Action, on } from '@ngrx/store';
import { MetadataActions } from '../actions';

export interface MetadataState {
  isLoaded: boolean;
}

const initialState: MetadataState = {
  isLoaded: false,
};

const adapterReducer = createReducer(
  initialState,
  on(MetadataActions.metadataLoaded, (state): MetadataState => {
    return {
      ...state,
      isLoaded: true,
    };
  }),
  on(MetadataActions.cleanState, () => initialState)
);

export function metadataReducer(state = initialState, action: Action): MetadataState {
  return adapterReducer(state, action);
}
