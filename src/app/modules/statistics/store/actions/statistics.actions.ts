import { StatisticsSnapshot } from '@budget-tracker/models';
import { createAction, props } from '@ngrx/store';

export const StatisticsActions = {
  loadStatisticsData: createAction('[Statistics] Load statistics data'),
  cleanState: createAction('[Statistics] Clean state'),
  statisticsLoaded: createAction(
    '[Statistics] Data loaded',
    props<{ snapshots: StatisticsSnapshot[] }>()
  ),
};
