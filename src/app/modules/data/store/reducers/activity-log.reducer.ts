import { Action, createReducer, on } from '@ngrx/store';
import { ActivityLogActions } from '../actions';
import { ActivityLog } from '../../models';

export interface ActivityLogState {
  activityLog: ActivityLog;
}

const initialState: ActivityLogState = {
  activityLog: [],
};

const adapterReducer = createReducer(
  initialState,

  on(ActivityLogActions.activityLogLoaded, (state, action) => ({
    ...state,
    activityLog: action.activityLog,
  })),

  on(ActivityLogActions.activityLogRecordAdded, (state, action) => ({
    ...state,
    activityLog: [...state.activityLog, action.record],
  })),

  on(ActivityLogActions.clean, () => initialState)
);

export function activityLogReducer(state = initialState, action: Action): ActivityLogState {
  return adapterReducer(state, action);
}
