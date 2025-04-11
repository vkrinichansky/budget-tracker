import { createAction, props } from '@ngrx/store';
import { Statistics } from '@budget-tracker/models';

export const StatisticsActions = {
  clean: createAction('[Statistics] Clean state'),
  statisticsLoaded: createAction('[Statistics] Data loaded', props<{ statistics: Statistics }>()),
};
