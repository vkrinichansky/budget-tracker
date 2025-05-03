import { createSelector } from '@ngrx/store';
import { dataFeatureSelector } from './feature.selector';
import { LanguagesEnum } from '@budget-tracker/models';

const statisticsStateSelector = createSelector(
  dataFeatureSelector,
  (dataFeatureState) => dataFeatureState.statisticsState
);

const statisticsSnapshotsSelector = (language: LanguagesEnum) =>
  createSelector(statisticsStateSelector, (state) =>
    Object.values(state.snapshots.entities)
      .sort((a, b) => parseInt(a.date) - parseInt(b.date))
      .map((snapshot) => ({
        ...snapshot,
        date: new Date(parseInt(snapshot.date)).toLocaleDateString(language, {
          year: 'numeric',
          month: 'short',
        }),
      }))
  );

const statisticsLoadedSelector = createSelector(statisticsStateSelector, (state) => state.isLoaded);

export const StatisticsSelectors = {
  statisticsStateSelector,
  statisticsSnapshotsSelector,
  statisticsLoadedSelector,
};
