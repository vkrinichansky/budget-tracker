import { Injectable } from '@angular/core';
import { SnapshotService } from '../snapshot-service/snapshot.service';
import { SnapshotApiService } from '../snapshot-api-service/snapshot-api.service';
import { DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Snapshot } from '../../models';

@Injectable()
export class SnapshotFacadeService {
  constructor(
    private readonly snapshotService: SnapshotService,
    private readonly snapshotApiService: SnapshotApiService
  ) {}

  // ===== SELECTORS =====
  getSnapshots(): Observable<Snapshot[]> {
    return this.snapshotService.getSnapshots();
  }

  snapshotsLoaded(): Observable<boolean> {
    return this.snapshotService.snapshotsLoaded();
  }

  // ===== ACTIONS =====
  loadSnapshots(): void {
    this.snapshotService.loadSnapshots();
  }

  addSnapshot(snapshot: Snapshot): void {
    this.snapshotService.addSnapshot(snapshot);
  }

  // ===== UTILS =====
  getSnapshotDocRef(): DocumentReference {
    return this.snapshotApiService.getDocRef();
  }
}
