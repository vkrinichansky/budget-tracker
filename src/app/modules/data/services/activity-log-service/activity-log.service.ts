import { Injectable } from '@angular/core';
import { arrayRemove, collection, doc, DocumentReference, Firestore, updateDoc } from '@angular/fire/firestore';
import {
  ActivityLogRecordUnitedType,
  Category,
  CategoryValueChangeRecord,
  RootValueChangeRecord,
  RootValueType,
} from '../../models';
import { Auth } from '@angular/fire/auth';

const ACTIVITY_LOG_PATH = 'budget.activityLog';
const CATEGORIES_PATH = 'budget.categories';
const ROOT_VALUES_PATH = 'budget.rootValues';

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
    updatedBalanceValue: number,
    updatedCategories: Category[]
  ): Promise<void> {
    if (updatedBalanceValue !== undefined && updatedCategories) {
      return updateDoc(this.getDocRef(), {
        [`${ACTIVITY_LOG_PATH}`]: arrayRemove(record),
        [`${CATEGORIES_PATH}.${record.budgetType}`]: updatedCategories,
        [`${ROOT_VALUES_PATH}.balance`]: updatedBalanceValue,
      });
    }

    if (updatedBalanceValue !== undefined && !updatedCategories) {
      return updateDoc(this.getDocRef(), {
        [`${ACTIVITY_LOG_PATH}`]: arrayRemove(record),
        [`${ROOT_VALUES_PATH}.balance`]: updatedBalanceValue,
      });
    }

    return updateDoc(this.getDocRef(), {
      [`${ACTIVITY_LOG_PATH}`]: arrayRemove(record),
    });
  }

  removeRootValueChangeRecord(
    record: RootValueChangeRecord,
    updatedValue: number,
    valueType: RootValueType
  ): Promise<void> {
    if (updatedValue !== undefined) {
      return updateDoc(this.getDocRef(), {
        [`${ACTIVITY_LOG_PATH}`]: arrayRemove(record),
        [`${ROOT_VALUES_PATH}.${valueType}`]: updatedValue,
      });
    }

    return updateDoc(this.getDocRef(), {
      [`${ACTIVITY_LOG_PATH}`]: arrayRemove(record),
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
