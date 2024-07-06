import { Action, createReducer, on } from '@ngrx/store';
import { MetadataActions } from '../actions';

export interface MetadataState {
  currencyChangingInProgress: boolean;
  languageChangingInProgress: boolean;
}

const initialState: MetadataState = {
  currencyChangingInProgress: false,
  languageChangingInProgress: false,
};

const adapterReducer = createReducer(
  initialState,
  on(MetadataActions.changeCurrency, (state) => ({
    ...state,
    currencyChangingInProgress: true,
  })),

  on(MetadataActions.changeLanguage, (state) => ({
    ...state,
    languageChangingInProgress: true,
  })),

  on(MetadataActions.changeCurrencyFail, (state) => ({
    ...state,
    currencyChangingInProgress: false,
  })),

  on(MetadataActions.changeLanguageFail, (state) => ({
    ...state,
    languageChangingInProgress: false,
  }))
);

export function metadataReducer(state = initialState, action: Action): MetadataState {
  return adapterReducer(state, action);
}
