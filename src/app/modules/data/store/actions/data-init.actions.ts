import { createAction, props } from '@ngrx/store';

export const DataInitActions = {
  init: createAction('[Data init] Init'),
  clean: createAction('[Data init] Clean state'),
  dataLoaded: createAction('[Data init] Data loaded'),
  resetDateLoaded: createAction('[Data init] Reset date loaded', props<{ resetDate: string }>()),
  resetData: createAction('[Data init] Reset data', props<{ data: any }>()),
};
