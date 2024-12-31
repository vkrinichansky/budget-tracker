import { createAction, props } from '@ngrx/store';
import { ActivityLogRecordUnitedType, ActivityLog, CategoryValueChangeRecord } from '../../models';

export const ActivityLogActions = {
  recordAdded: createAction(
    '[ActivityLog] Record added',
    props<{ record: ActivityLogRecordUnitedType }>()
  ),

  activityLogLoaded: createAction(
    '[ActivityLog] Activity log loaded',
    props<{ activityLog: ActivityLog }>()
  ),

  clean: createAction('[ActivityLog] Clean state'),

  removeRecord: createAction('[ActivityLog] Remove record', props<{ recordId: string }>()),

  removeCategoryValueChangeRecord: createAction(
    '[ActivityLog] Remove category value change record',
    props<{
      record: CategoryValueChangeRecord;
      updatedAccountId: string;
      updatedAccountValue: number;
      updatedCategoryId: string;
      updatedCategoryValue: number;
    }>()
  ),

  activityLogRecordRemoved: createAction(
    '[ActivityLog] Record removed',
    props<{ recordId: string }>()
  ),

  removeRecordFail: createAction('[ActivityLog] Remove record fail', props<{ recordId: string }>()),

  bulkRecordsRemove: createAction('[ActivityLog] Bulk records remove'),

  bulkRecordsRemoved: createAction('[ActivityLog] Bulk records removed'),

  bulkRecordsRemoveFail: createAction('[ActivityLog] Bulk records remove fail'),
};
