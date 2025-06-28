import { createSelector } from '@ngrx/store';
import { dataFeatureSelector } from './feature.selector';

const statisticsStateSelector = createSelector(
  dataFeatureSelector,
  (dataFeatureState) => dataFeatureState.statisticsState
);

const statisticsSnapshotsSelector = createSelector(statisticsStateSelector, (state) =>
  Object.values(state.snapshots.entities).sort((a, b) => parseInt(b.date) - parseInt(a.date))
);

const statisticsLoadedSelector = createSelector(statisticsStateSelector, (state) => state.isLoaded);

export const StatisticsSelectors = {
  statisticsStateSelector,
  statisticsSnapshotsSelector,
  statisticsLoadedSelector,
};
