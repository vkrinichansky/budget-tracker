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
  activityLogRecordAdded: createAction('[ActivityLog] Record added', props<{ record: ActivityLogRecordUnitedType }>()),

  activityLogLoaded: createAction('[ActivityLog] Activity log loaded', props<{ activityLog: ActivityLog }>()),

  clean: createAction('[ActivityLog] Clean state'),

  removeActivityLogRecord: createAction('[ActivityLog] Remove record', props<{ recordId: string }>()),

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

  removeActivityLogRecordFail: createAction('[ActivityLog] Remove record fail', props<{ recordId: string }>()),
};
