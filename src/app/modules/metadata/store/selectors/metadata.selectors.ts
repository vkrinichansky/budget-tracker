import { createSelector } from '@ngrx/store';
import { metadataFeatureSelector } from './feature.selector';

const metadataStateSelector = createSelector(
  metadataFeatureSelector,
  (metadataFeatureState) => metadataFeatureState.metadataState
);

const currencySelector = createSelector(metadataStateSelector, (state) => state.currency);
const metadataLoadedSelector = createSelector(metadataStateSelector, (state) => state.isLoaded);

export const MetadataSelectors = {
  currencySelector,
  metadataLoadedSelector,
};
