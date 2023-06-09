import { ActivityLog, ActivityLogRecordUnitedType } from '@budget-tracker/shared';
import { createAction, props } from '@ngrx/store';

enum ActivityLogActionsType {
  ActivityLogLoaded = '[ActivityLog] Activity log loaded',
  ActivityLogRecordAdded = '[ActivityLog] Record added',
}

export const ActivityLogActions = {
  activityLogRecordAdded: createAction(
    ActivityLogActionsType.ActivityLogRecordAdded,
    props<{ record: ActivityLogRecordUnitedType }>()
  ),

  activityLogLoaded: createAction(ActivityLogActionsType.ActivityLogLoaded, props<{ activityLog: ActivityLog }>()),
};
