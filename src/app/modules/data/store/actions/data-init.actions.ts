import { createAction } from '@ngrx/store';

export const DataInitActions = {
  init: createAction('[Budget Tracker] Init'),
  clean: createAction('[Budget Tracker] Clean state'),
  dataLoaded: createAction('[Budget Tracker] Data loaded'),
};
