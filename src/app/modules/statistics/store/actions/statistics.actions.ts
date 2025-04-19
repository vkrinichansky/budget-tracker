import { StatisticsSnapshot } from '@budget-tracker/models';
import { createAction, props } from '@ngrx/store';

export const StatisticsActions = {
  init: createAction('[Statistics] CInit'),
  clean: createAction('[Statistics] Clean state'),
  statisticsLoaded: createAction(
    '[Statistics] Data loaded',
    props<{ snapshots: StatisticsSnapshot[] }>()
  ),
};
