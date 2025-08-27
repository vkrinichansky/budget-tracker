import { Injectable } from '@angular/core';
import {
  collection,
  deleteField,
  doc,
  DocumentReference,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,
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

  addRecord(record: ActivityLogRecordUnitedType): Promise<void> {
    return updateDoc(this.getDocRef(), {
      [record.id]: record,
    });
  }

  removeRecord(recordId: string): Promise<void> {
    return updateDoc(this.getDocRef(), {
      [recordId]: deleteField(),
    });
  }

  bulkRecordRemove(): Promise<void> {
    return setDoc(this.getDocRef(), {});
  }

  private getDocRef(): DocumentReference {
    return doc(collection(this.firestore, 'activityLog'), this.afAuth.currentUser?.uid);
  }
}
