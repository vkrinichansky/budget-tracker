import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  DocumentReference,
  Firestore,
  getDoc,
  setDoc,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { ActivityLogRecordUnitedType } from '../../models';

@Injectable()
export class ActivityLogApiService {
  constructor(
    private firestore: Firestore,
    private afAuth: Auth
  ) {}

  async loadActivityLog(): Promise<Record<string, ActivityLogRecordUnitedType>> {
    const doc = await getDoc(this.getDocRef());

    if (doc.exists()) {
      return doc.data() as Record<string, ActivityLogRecordUnitedType>;
    }

    await setDoc(this.getDocRef(), {});
    return {};
  }

  bulkRecordRemove(): Promise<void> {
    return setDoc(this.getDocRef(), {});
  }

  getDocRef(): DocumentReference {
    return doc(collection(this.firestore, 'activityLog'), this.afAuth.currentUser?.uid);
  }
}
