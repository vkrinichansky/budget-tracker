import { Injectable } from '@angular/core';
import {
  Account,
  AccountValueEditRecord,
  MoveMoneyBetweenAccountsRecord,
} from '@budget-tracker/models';
import { Auth } from '@angular/fire/auth';
import {
  arrayUnion,
  collection,
  deleteField,
  doc,
  DocumentReference,
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';

const ACCOUNTS_PATH = 'accounts';
const ACTIVITY_LOG_PATH = 'activityLog';

@Injectable()
export class AccountsApiService {
  constructor(
    private firestore: Firestore,
    private afAuth: Auth
  ) {}

  addAccount(account: Account, updatedAccountsOrder: Record<string, number>): Promise<void> {
    const payload = Object.entries(updatedAccountsOrder).reduce(
      (result, entry) => ({ ...result, [`${ACCOUNTS_PATH}.${entry[0]}.order`]: entry[1] }),
      {}
    );

    return updateDoc(this.getDocRef(), {
      [`${ACCOUNTS_PATH}.${account.id}`]: account,
      ...payload,
    });
  }

  async removeAccount(
    accountId: string,
    updatedAccountsOrder: Record<string, number>
  ): Promise<void> {
    const payload = Object.entries(updatedAccountsOrder).reduce(
      (result, entry) => ({ ...result, [`${ACCOUNTS_PATH}.${entry[0]}.order`]: entry[1] }),
      {}
    );

    return updateDoc(this.getDocRef(), {
      [`${ACCOUNTS_PATH}.${accountId}`]: deleteField(),
      ...payload,
    });
  }

  editAccountValue(
    accountId: string,
    newValue: number,
    activityLogRecord: AccountValueEditRecord
  ): Promise<void> {
    return updateDoc(this.getDocRef(), {
      [`${ACCOUNTS_PATH}.${accountId}.value`]: newValue,
      [`${ACTIVITY_LOG_PATH}`]: arrayUnion(activityLogRecord),
    });
  }

  moveMoneyBetweenAccounts(
    fromAccountId: string,
    toAccountId: string,
    fromAccountNewValue: number,
    toAccountNewValue: number,
    activityLogRecord: MoveMoneyBetweenAccountsRecord
  ): Promise<void> {
    return updateDoc(this.getDocRef(), {
      [`${ACCOUNTS_PATH}.${fromAccountId}.value`]: fromAccountNewValue,
      [`${ACCOUNTS_PATH}.${toAccountId}.value`]: toAccountNewValue,
      [`${ACTIVITY_LOG_PATH}`]: arrayUnion(activityLogRecord),
    });
  }

  bulkAccountChangeOrder(updatedAccountsOrder: Record<string, number>): Promise<void> {
    const payload = Object.entries(updatedAccountsOrder).reduce(
      (result, entry) => ({ ...result, [`${ACCOUNTS_PATH}.${entry[0]}.order`]: entry[1] }),
      {}
    );

    return updateDoc(this.getDocRef(), {
      ...payload,
    });
  }

  private getDocRef(): DocumentReference {
    return doc(collection(this.firestore, 'dashboard'), this.afAuth.currentUser?.uid);
  }
}
