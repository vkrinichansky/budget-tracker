import { Injectable } from '@angular/core';
import { AccountValueEditRecord } from '../../models';
import { Auth } from '@angular/fire/auth';
import { arrayUnion, collection, doc, DocumentReference, Firestore, updateDoc } from '@angular/fire/firestore';

const ACCOUNTS_PATH = 'budget.accounts';
const ACTIVITY_LOG_PATH = 'budget.activityLog';

@Injectable()
export class AccountsService {
  constructor(
    private firestore: Firestore,
    private afAuth: Auth
  ) {}

  editAccountValue(accountId: string, newValue: number, activityLogRecord: AccountValueEditRecord): Promise<void> {
    return updateDoc(this.getDocRef(), {
      [`${ACCOUNTS_PATH}.${accountId}.value`]: newValue,
      [`${ACTIVITY_LOG_PATH}`]: arrayUnion(activityLogRecord),
    });
  }

  private getDocRef(): DocumentReference {
    return doc(collection(this.firestore, 'userData'), this.afAuth.currentUser?.uid);
  }
}
