import { createAction, props } from '@ngrx/store';

export const StatisticsActions = {
  clean: createAction('[Statistics] Clean state'),
  statisticsLoaded: createAction('[Statistics] Data loaded', props<{ statistics: any }>()),
};
