import { Action, createReducer, on } from '@ngrx/store';
import { StatisticsActions } from '../actions';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { StatisticsSnapshot } from '@budget-tracker/models';

export interface StatisticsState {
  snapshots: EntityState<StatisticsSnapshot>;
  isLoaded: boolean;
}

function selectSnapshotId(snapshot: StatisticsSnapshot): string {
  return snapshot.date;
}

export const statisticsSnapshotsEntityAdapter = createEntityAdapter({
  selectId: selectSnapshotId,
});

const initialState: StatisticsState = {
  snapshots: statisticsSnapshotsEntityAdapter.getInitialState({}),
  isLoaded: false,
};

const adapterReducer = createReducer(
  initialState,

  on(StatisticsActions.clean, () => initialState),

  on(
    StatisticsActions.statisticsLoaded,
    (state, action): StatisticsState => ({
      ...state,
      snapshots: statisticsSnapshotsEntityAdapter.addMany(action.snapshots, state.snapshots),
      isLoaded: true,
    })
  )
);

export function statisticsReducer(state = initialState, action: Action): StatisticsState {
  return adapterReducer(state, action);
}
