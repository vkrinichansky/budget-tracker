import { createSelector } from '@ngrx/store';
import { dataFeatureSelector } from './feature.selector';

const metadataStateSelector = createSelector(
  dataFeatureSelector,
  (dataFeatureState) => dataFeatureState.metadataState
);

const currencyChangingInProgressSelector = createSelector(
  metadataStateSelector,
  (state) => state.currencyChangingInProgress
);

const languageChangingInProgressSelector = createSelector(
  metadataStateSelector,
  (state) => state.languageChangingInProgress
);

export const MetadataSelectors = {
  currencyChangingInProgressSelector,
  languageChangingInProgressSelector,
};
