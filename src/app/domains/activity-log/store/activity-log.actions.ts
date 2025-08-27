import { createAction, props } from '@ngrx/store';
import { ActivityLog, ActivityLogRecordUnitedType } from '../models';

export const ActivityLogActions = {
  loadActivityLog: createAction('[ActivityLog] Load activity log'),
  activityLogLoaded: createAction(
    '[ActivityLog] Activity log loaded',
    props<{ activityLog: ActivityLog }>()
  ),
  cleanState: createAction('[ActivityLog] Clean state'),

  addRecord: createAction(
    '[ActivityLog] Add record',
    props<{
      record: ActivityLogRecordUnitedType;
    }>()
  ),
  recordAdded: createAction(
    '[ActivityLog] Record added',
    props<{ record: ActivityLogRecordUnitedType }>()
  ),

  removeRecord: createAction(
    '[ActivityLog] Remove category value change record',
    props<{
      recordId: string;
    }>()
  ),
  recordRemoved: createAction('[ActivityLog] Record removed', props<{ recordId: string }>()),

  bulkRecordsRemove: createAction('[ActivityLog] Bulk records remove'),
  bulkRecordsRemoved: createAction('[ActivityLog] Bulk records removed'),
  bulkRecordsRemoveFail: createAction('[ActivityLog] Bulk records remove fail'),
};
