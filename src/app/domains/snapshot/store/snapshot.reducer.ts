import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { SnapshotActions } from './snapshot.actions';
import { Snapshot } from '../models';

export interface SnapshotState {
  snapshots: EntityState<Snapshot>;
  isLoaded: boolean;
}

function selectSnapshotId(snapshot: Snapshot) {
  return snapshot.date;
}

export const snapshotEntityAdapter = createEntityAdapter({
  selectId: selectSnapshotId,
});

const initialState: SnapshotState = {
  snapshots: snapshotEntityAdapter.getInitialState({}),
  isLoaded: false,
};

const adapterReducer = createReducer(
  initialState,

  on(
    SnapshotActions.snapshotsLoaded,
    (state, action): SnapshotState => ({
      ...state,
      snapshots: snapshotEntityAdapter.upsertMany(action.snapshots, state.snapshots),
      isLoaded: true,
    })
  ),

  on(
    SnapshotActions.snapshotAdded,
    (state, action): SnapshotState => ({
      ...state,
      snapshots: snapshotEntityAdapter.addOne(action.snapshot, state.snapshots),
    })
  ),

  on(SnapshotActions.cleanState, (): SnapshotState => initialState)
);

export function snapshotReducer(state = initialState, action: Action): SnapshotState {
  return adapterReducer(state, action);
}
