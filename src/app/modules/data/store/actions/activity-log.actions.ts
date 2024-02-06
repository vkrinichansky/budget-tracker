import { createAction, props } from '@ngrx/store';
import { ActivityLogRecordUnitedType, ActivityLog } from '../../models';

enum ActivityLogActionsType {
  ActivityLogLoaded = '[ActivityLog] Activity log loaded',
  ActivityLogRecordAdded = '[ActivityLog] Record added',

  Clean = '[ActivityLog] Clean state',
}

export const ActivityLogActions = {
  activityLogRecordAdded: createAction(
    ActivityLogActionsType.ActivityLogRecordAdded,
    props<{ record: ActivityLogRecordUnitedType }>()
  ),

  activityLogLoaded: createAction(ActivityLogActionsType.ActivityLogLoaded, props<{ activityLog: ActivityLog }>()),

  clean: createAction(ActivityLogActionsType.Clean),
};
