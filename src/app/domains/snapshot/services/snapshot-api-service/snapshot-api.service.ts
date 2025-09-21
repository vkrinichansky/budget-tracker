import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  collection,
  doc,
  DocumentReference,
  Firestore,
  getDoc,
  setDoc,
} from '@angular/fire/firestore';
import { Snapshot } from '../../models';

@Injectable()
export class SnapshotApiService {
  constructor(
    private firestore: Firestore,
    private afAuth: Auth
  ) {}

  async loadSnapshots(): Promise<Record<string, Snapshot>> {
    const doc = await getDoc(this.getDocRef());

    if (doc.exists()) {
      return doc.data() as Record<string, Snapshot>;
    }

    await setDoc(this.getDocRef(), {});

    return {};
  }

  getDocRef(): DocumentReference {
    return doc(collection(this.firestore, 'snapshots'), this.afAuth.currentUser?.uid);
  }
}
