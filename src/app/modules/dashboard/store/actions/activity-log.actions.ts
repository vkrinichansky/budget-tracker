import { createAction, props } from '@ngrx/store';
import {
  ActivityLogRecordUnitedType,
  ActivityLog,
  CategoryValueChangeRecord,
} from '@budget-tracker/models';

export const ActivityLogActions = {
  activityLogLoaded: createAction(
    '[ActivityLog] Activity log loaded',
    props<{ activityLog: ActivityLog }>()
  ),
  cleanState: createAction('[ActivityLog] Clean state'),

  recordAdded: createAction(
    '[ActivityLog] Record added',
    props<{ record: ActivityLogRecordUnitedType }>()
  ),

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
