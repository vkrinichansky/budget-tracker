import { ActivityLog } from '@budget-tracker/shared';
import { createFeature, createReducer, on } from '@ngrx/store';
import { ActivityLogActions } from '../actions';

const ActivityLogFeatureName = 'activityLog';

export interface ActivityLogState {
  activityLog: ActivityLog;
}

const initialState: ActivityLogState = {
  activityLog: [],
};

export const activityLogFeature = createFeature({
  name: ActivityLogFeatureName,
  reducer: createReducer(
    initialState,

    on(ActivityLogActions.activityLogLoaded, (state, action) => ({
      ...state,
      activityLog: action.activityLog,
    })),

    on(ActivityLogActions.activityLogRecordAdded, (state, action) => ({
      ...state,
      activityLog: [...state.activityLog, action.record],
    }))
  ),
});

export const { name, reducer, selectActivityLogState, selectActivityLog } = activityLogFeature;
