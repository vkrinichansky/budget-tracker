import { Injectable } from '@angular/core';
import { arrayRemove, collection, doc, DocumentReference, Firestore, updateDoc } from '@angular/fire/firestore';
import { Account, ActivityLogRecordUnitedType, Category, CategoryValueChangeRecord } from '../../models';
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
    updatedAccount: Account,
    updatedCategory: Category
  ): Promise<void> {
    if (updatedAccount) {
      return updateDoc(this.getDocRef(), {
        [`${ACTIVITY_LOG_PATH}`]: arrayRemove(record),
        [`${CATEGORIES_PATH}.${updatedCategory.id}`]: updatedCategory,
        [`${ACCOUNTS_PATH}.${updatedAccount.id}`]: updatedAccount,
      });
    }

    return updateDoc(this.getDocRef(), {
      [`${ACTIVITY_LOG_PATH}`]: arrayRemove(record),
      [`${CATEGORIES_PATH}.${updatedCategory.id}`]: updatedCategory,
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
