import { createSelector } from '@ngrx/store';
import { dataFeatureSelector } from './feature.selector';

const statisticsStateSelector = createSelector(
  dataFeatureSelector,
  (dataFeatureState) => dataFeatureState.statisticsState
);

const statisticsSnapshotsSelector = createSelector(statisticsStateSelector, (state) =>
  Object.values(state.snapshots.entities)
);

export const StatisticsSelectors = {
  statisticsStateSelector,
  statisticsSnapshotsSelector,
};
