import { Action, createReducer, on } from '@ngrx/store';
import { ActivityLogActions } from '../actions';
import { ActivityLogRecordUnitedType } from '../../models';
import { EntityState, createEntityAdapter } from '@ngrx/entity';

export interface ActivityLogState {
  activityLogRecords: EntityState<ActivityLogRecordUnitedType>;
  removingRecordsIds: string[];
}

function selectRecordId(record: ActivityLogRecordUnitedType): string {
  return record.id;
}

export const activityLogRecordsEntityAdapter = createEntityAdapter({
  selectId: selectRecordId,
});

const initialState: ActivityLogState = {
  activityLogRecords: activityLogRecordsEntityAdapter.getInitialState({}),
  removingRecordsIds: [],
};

const adapterReducer = createReducer(
  initialState,

  on(ActivityLogActions.activityLogLoaded, (state, action) => ({
    ...state,
    activityLogRecords: activityLogRecordsEntityAdapter.addMany(action.activityLog, state.activityLogRecords),
  })),

  on(ActivityLogActions.activityLogRecordAdded, (state, action) => ({
    ...state,
    activityLogRecords: activityLogRecordsEntityAdapter.addOne(action.record, state.activityLogRecords),
  })),

  on(ActivityLogActions.clean, () => initialState),

  on(ActivityLogActions.removeActivityLogRecord, (state, action) => ({
    ...state,
    removingRecordsIds: [...state.removingRecordsIds, action.recordId],
  })),

  on(ActivityLogActions.removeCategoryValueChangeRecord, (state, action) => ({
    ...state,
    removingRecordsIds: [...state.removingRecordsIds, action.record.id],
  })),

  on(ActivityLogActions.removeRootValueChangeRecord, (state, action) => ({
    ...state,
    removingRecordsIds: [...state.removingRecordsIds, action.record.id],
  })),

  on(ActivityLogActions.activityLogRecordRemoved, (state, action) => ({
    ...state,
    activityLogRecords: activityLogRecordsEntityAdapter.removeOne(action.recordId, state.activityLogRecords),
    removingRecordsIds: state.removingRecordsIds.filter((recordId) => recordId !== action.recordId),
  })),

  on(ActivityLogActions.removeActivityLogRecordFail, (state, action) => ({
    ...state,
    removingRecordsIds: state.removingRecordsIds.filter((recordId) => recordId !== action.recordId),
  }))
);

export function activityLogReducer(state = initialState, action: Action): ActivityLogState {
  return adapterReducer(state, action);
}
