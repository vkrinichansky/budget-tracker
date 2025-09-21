import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, map, switchMap } from 'rxjs';
import { SnapshotActions } from './snapshot.actions';
import { SnapshotApiService } from '../services';

@Injectable()
export class SnapshotEffects {
  constructor(
    private actions$: Actions,
    private snapshotService: SnapshotApiService
  ) {}

  readonly loadSnapshots$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SnapshotActions.loadSnapshots),
      switchMap(() => from(this.snapshotService.loadSnapshots())),
      map((snapshots) => SnapshotActions.snapshotsLoaded({ snapshots: Object.values(snapshots) }))
    )
  );
}
