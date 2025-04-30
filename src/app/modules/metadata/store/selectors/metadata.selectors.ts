import { createSelector } from '@ngrx/store';
import { metadataFeatureSelector } from './feature.selector';

const metadataStateSelector = createSelector(
  metadataFeatureSelector,
  (metadataFeatureState) => metadataFeatureState.metadataState
);

const metadataLoadedSelector = createSelector(metadataStateSelector, (state) => state.isLoaded);

export const MetadataSelectors = {
  metadataLoadedSelector,
};
