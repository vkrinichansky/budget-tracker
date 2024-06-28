import { createAction, props } from '@ngrx/store';
import {
  ActivityLogRecordUnitedType,
  ActivityLog,
  CategoryValueChangeRecord,
  Category,
  RootValueChangeRecord,
  RootValueType,
} from '../../models';

export const ActivityLogActions = {
  recordAdded: createAction('[ActivityLog] Record added', props<{ record: ActivityLogRecordUnitedType }>()),

  activityLogLoaded: createAction('[ActivityLog] Activity log loaded', props<{ activityLog: ActivityLog }>()),

  clean: createAction('[ActivityLog] Clean state'),

  removeRecord: createAction('[ActivityLog] Remove record', props<{ recordId: string }>()),

  removeCategoryValueChangeRecord: createAction(
    '[ActivityLog] Remove category value change record',
    props<{
      record: CategoryValueChangeRecord;
      updatedBalanceValue: number;
      updatedCategory: Category;
      updatedCategories: Category[];
    }>()
  ),

  removeRootValueChangeRecord: createAction(
    '[ActivityLog] Remove root value change record',
    props<{
      record: RootValueChangeRecord;
      updatedValue: number;
      valueType: RootValueType;
    }>()
  ),

  activityLogRecordRemoved: createAction('[ActivityLog] Record removed', props<{ recordId: string }>()),

  removeRecordFail: createAction('[ActivityLog] Remove record fail', props<{ recordId: string }>()),

  bulkRecordsRemove: createAction(
    '[ActivityLog] Bulk records remove',
    props<{
      records: ActivityLogRecordUnitedType[];
      shouldDisplaySnackbar: boolean;
    }>()
  ),

  bulkRecordsRemoved: createAction(
    '[ActivityLog] Bulk records removed',
    props<{ records: ActivityLogRecordUnitedType[] }>()
  ),

  bulkRecordsRemoveFail: createAction('[ActivityLog] Bulk records remove fail'),
};
