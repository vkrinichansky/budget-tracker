import { createSelector } from '@ngrx/store';
import { dataFeatureSelector } from './feature.selector';

const allSnapshotsDictionarySelector = createSelector(
  dataFeatureSelector,
  (state) => state.snapshots.entities
);

const snapshotsLoadedSelector = createSelector(dataFeatureSelector, (state) => state.isLoaded);

const allSnapshotsSelector = createSelector(allSnapshotsDictionarySelector, (snapshotsDictionary) =>
  Object.values(snapshotsDictionary)
);

export const SnapshotSelectors = {
  snapshotsLoadedSelector,
  allSnapshotsSelector,
};
