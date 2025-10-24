import { createAction, props } from '@ngrx/store';
import { Snapshot } from '../models';

export const SnapshotActions = {
  loadSnapshots: createAction('[Snapshot] Load snapshots'),
  snapshotsLoaded: createAction('[Snapshot] Snapshots loaded', props<{ snapshots: Snapshot[] }>()),
  cleanState: createAction('[Snapshot] Clean state'),

  snapshotAdded: createAction('[Snapshot] Snapshot added', props<{ snapshot: Snapshot }>()),
};
