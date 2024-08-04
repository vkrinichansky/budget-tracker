import { Injectable } from '@angular/core';
import {
  arrayRemove,
  collection,
  doc,
  DocumentReference,
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';
import { ActivityLogRecordUnitedType, CategoryValueChangeRecord } from '../../models';
import { Auth } from '@angular/fire/auth';

const ACTIVITY_LOG_PATH = 'budget.activityLog';
const CATEGORIES_PATH = 'budget.categories';
const ACCOUNTS_PATH = 'budget.accounts';

@Injectable()
export class ActivityLogService {
  constructor(
    private firestore: Firestore,
    private afAuth: Auth
  ) {}

  removeRecord(record: ActivityLogRecordUnitedType): Promise<void> {
    return updateDoc(this.getDocRef(), {
      [`${ACTIVITY_LOG_PATH}`]: arrayRemove(record),
    });
  }

  removeCategoryValueChangeRecord(
    record: CategoryValueChangeRecord,
    updatedAccountId: string,
    updatedAccountValue: number,
    updatedCategoryId: string,
    updatedCategoryValue: number
  ): Promise<void> {
    if (updatedAccountValue !== null) {
      return updateDoc(this.getDocRef(), {
        [`${ACTIVITY_LOG_PATH}`]: arrayRemove(record),
        [`${CATEGORIES_PATH}.${updatedCategoryId}.value`]: updatedCategoryValue,
        [`${ACCOUNTS_PATH}.${updatedAccountId}.value`]: updatedAccountValue,
      });
    }

    return updateDoc(this.getDocRef(), {
      [`${ACTIVITY_LOG_PATH}`]: arrayRemove(record),
      [`${CATEGORIES_PATH}.${updatedCategoryId}.value`]: updatedCategoryValue,
    });
  }

  bulkRecordRemove(records: ActivityLogRecordUnitedType[]): Promise<void> {
    return updateDoc(this.getDocRef(), {
      [`${ACTIVITY_LOG_PATH}`]: arrayRemove(...records),
    });
  }

  private getDocRef(): DocumentReference {
    return doc(collection(this.firestore, 'userData'), this.afAuth.currentUser?.uid);
  }
}
