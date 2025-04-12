import { CurrencyExchangeRate, UserMetadata } from '@budget-tracker/models';
import { createReducer, Action, on } from '@ngrx/store';
import { MetadataActions } from '../actions';

export interface MetadataState extends UserMetadata {
  currencyExchangeRate: CurrencyExchangeRate;
  isLoaded: boolean;
}

const initialState: MetadataState = {
  currency: null,
  language: null,
  currencyExchangeRate: null,
  isLoaded: false,
};

const adapterReducer = createReducer(
  initialState,
  on(MetadataActions.metadataLoaded, (state, action): MetadataState => {
    return {
      ...state,
      currency: action.currency,
      language: action.language,
      currencyExchangeRate: action.currencyExchangeRate,
      isLoaded: true,
    };
  })
);

export function metadataReducer(state = initialState, action: Action): MetadataState {
  return adapterReducer(state, action);
}
