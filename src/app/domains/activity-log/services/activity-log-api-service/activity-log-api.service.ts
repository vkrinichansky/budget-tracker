import { Injectable } from '@angular/core';
import {
  collection,
  deleteField,
  doc,
  DocumentReference,
  Firestore,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { ActivityLog, ActivityLogRecordUnitedType } from '../../models';

@Injectable()
export class ActivityLogApiService {
  constructor(
    private firestore: Firestore,
    private afAuth: Auth
  ) {}

  async loadActivityLog(): Promise<ActivityLog> {
    return getDoc(this.getDocRef()).then((doc) => doc.data() as ActivityLog);
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
    return updateDoc(this.getDocRef(), {});
  }

  private getDocRef(): DocumentReference {
    return doc(collection(this.firestore, 'activityLog'), this.afAuth.currentUser?.uid);
  }
}
