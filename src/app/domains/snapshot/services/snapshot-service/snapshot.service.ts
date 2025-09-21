import { Injectable } from '@angular/core';
import { SnapshotActions } from '../../store/snapshot.actions';
import { SnapshotSelectors } from '../../store/snapshot.selectors';
import { firstValueFrom, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Snapshot } from '../../models';

@Injectable()
export class SnapshotService {
  constructor(private readonly store: Store) {}

  // ===== SELECTORS =====
  getSnapshots(): Observable<Snapshot[]> {
    return this.store.select(SnapshotSelectors.allSnapshotsSelector);
  }

  snapshotsLoaded(): Observable<boolean> {
    return this.store.select(SnapshotSelectors.snapshotsLoadedSelector);
  }

  // ===== ACTIONS =====
  async loadSnapshots(): Promise<void> {
    const isLoaded = await firstValueFrom(this.snapshotsLoaded());

    if (!isLoaded) {
      this.store.dispatch(SnapshotActions.loadSnapshots());
    }
  }
}
