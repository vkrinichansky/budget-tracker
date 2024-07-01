import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { updateDoc, arrayUnion, DocumentReference, collection, doc, Firestore } from '@angular/fire/firestore';
import { RootValueChangeRecord } from '../../models';

const ROOT_VALUES_PATH = 'budget.rootValues';
const ACTIVITY_LOG_PATH = 'budget.activityLog';

@Injectable()
export class RootValuesService {
  constructor(
    private firestore: Firestore,
    private afAuth: Auth
  ) {}

  updateBalance(newBalanceValue: number, activityLogRecord: RootValueChangeRecord): Promise<void> {
    return updateDoc(this.getDocRef(), {
      [`${ROOT_VALUES_PATH}.balance`]: newBalanceValue,
      [`${ACTIVITY_LOG_PATH}`]: arrayUnion(activityLogRecord),
    });
  }

  updateSavings(newSavingsValue: number, activityLogRecord: RootValueChangeRecord): Promise<void> {
    return updateDoc(this.getDocRef(), {
      [`${ROOT_VALUES_PATH}.savings`]: newSavingsValue,
      [`${ACTIVITY_LOG_PATH}`]: arrayUnion(activityLogRecord),
    });
  }

  updateFreeMoney(newFreeMoneyValue: number, activityLogRecord: RootValueChangeRecord): Promise<void> {
    return updateDoc(this.getDocRef(), {
      [`${ROOT_VALUES_PATH}.freeMoney`]: newFreeMoneyValue,
      [`${ACTIVITY_LOG_PATH}`]: arrayUnion(activityLogRecord),
    });
  }

  private getDocRef(): DocumentReference {
    return doc(collection(this.firestore, 'userData'), this.afAuth.currentUser?.uid);
  }
}
