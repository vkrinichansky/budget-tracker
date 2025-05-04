import { Action, createReducer, on } from '@ngrx/store';
import { ActivityLogActions } from '../actions';
import { ActivityLogRecordUnitedType } from '@budget-tracker/models';
import { EntityState, createEntityAdapter } from '@ngrx/entity';

export interface ActivityLogState {
  activityLogRecords: EntityState<ActivityLogRecordUnitedType>;
  isLoaded: boolean;
}

function selectRecordId(record: ActivityLogRecordUnitedType): string {
  return record.id;
}

export const activityLogRecordsEntityAdapter = createEntityAdapter({
  selectId: selectRecordId,
});

const initialState: ActivityLogState = {
  activityLogRecords: activityLogRecordsEntityAdapter.getInitialState({}),
  isLoaded: false,
};

const adapterReducer = createReducer(
  initialState,

  on(
    ActivityLogActions.activityLogLoaded,
    (state, action): ActivityLogState => ({
      ...state,
      activityLogRecords: activityLogRecordsEntityAdapter.addMany(
        action.activityLog,
        state.activityLogRecords
      ),
      isLoaded: true,
    })
  ),

  on(
    ActivityLogActions.recordAdded,
    (state, action): ActivityLogState => ({
      ...state,
      activityLogRecords: activityLogRecordsEntityAdapter.addOne(
        action.record,
        state.activityLogRecords
      ),
    })
  ),

  on(
    ActivityLogActions.activityLogRecordRemoved,
    (state, action): ActivityLogState => ({
      ...state,
      activityLogRecords: activityLogRecordsEntityAdapter.removeOne(
        action.recordId,
        state.activityLogRecords
      ),
    })
  ),

  on(
    ActivityLogActions.bulkRecordsRemoved,
    (state): ActivityLogState => ({
      ...state,
      activityLogRecords: activityLogRecordsEntityAdapter.removeAll(state.activityLogRecords),
    })
  ),

  on(ActivityLogActions.cleanState, (): ActivityLogState => initialState)
);

export function activityLogReducer(state = initialState, action: Action): ActivityLogState {
  return adapterReducer(state, action);
}
