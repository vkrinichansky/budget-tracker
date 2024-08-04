import { Action, createReducer, on } from '@ngrx/store';
import { StatisticsActions } from '../actions';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { StatisticsSnapshot } from '../../models';

export interface StatisticsState {
  snapshots: EntityState<StatisticsSnapshot>;
}

function selectSnapshotId(snapshot: StatisticsSnapshot): string {
  return snapshot.date;
}

export const statisticsSnapshotsEntityAdapter = createEntityAdapter({
  selectId: selectSnapshotId,
});

const initialState: StatisticsState = {
  snapshots: statisticsSnapshotsEntityAdapter.getInitialState({}),
};

const adapterReducer = createReducer(
  initialState,

  on(StatisticsActions.clean, () => initialState),

  on(StatisticsActions.statisticsLoaded, (state, action) => ({
    ...state,
    snapshots: statisticsSnapshotsEntityAdapter.addMany(
      Object.values(action.statistics.snapshots),
      state.snapshots
    ),
  }))
);

export function statisticsReducer(state = initialState, action: Action): StatisticsState {
  return adapterReducer(state, action);
}
