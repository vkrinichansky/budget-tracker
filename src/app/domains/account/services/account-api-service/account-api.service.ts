import { Injectable } from '@angular/core';
import { Account } from '../../models';
import { Auth } from '@angular/fire/auth';
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

@Injectable()
export class AccountApiService {
  constructor(
    private firestore: Firestore,
    private afAuth: Auth
  ) {}

  async initAccountDB(): Promise<void> {
    return setDoc(this.getDocRef(), {});
  }

  async loadAccounts(): Promise<Record<string, Account>> {
    return getDoc(this.getDocRef()).then((doc): Record<string, Account> => doc.data());
  }

  addAccount(account: Account, updatedAccountsOrder: Record<string, number>): Promise<void> {
    const payload = Object.entries(updatedAccountsOrder).reduce(
      (result, entry) => ({ ...result, [`${entry[0]}.order`]: entry[1] }),
      {}
    );

    return updateDoc(this.getDocRef(), {
      [account.id]: account,
      ...payload,
    });
  }

  async removeAccount(
    accountId: string,
    updatedAccountsOrder: Record<string, number>
  ): Promise<void> {
    const payload = Object.entries(updatedAccountsOrder).reduce(
      (result, entry) => ({ ...result, [`${entry[0]}.order`]: entry[1] }),
      {}
    );

    return updateDoc(this.getDocRef(), {
      [accountId]: deleteField(),
      ...payload,
    });
  }

  moveMoneyBetweenAccounts(
    fromAccountId: string,
    toAccountId: string,
    fromAccountNewValue: number,
    toAccountNewValue: number
  ): Promise<void> {
    return updateDoc(this.getDocRef(), {
      [`${fromAccountId}.value`]: fromAccountNewValue,
      [`${toAccountId}.value`]: toAccountNewValue,
    });
  }

  bulkAccountChangeOrder(updatedAccountsOrder: Record<string, number>): Promise<void> {
    const payload = Object.entries(updatedAccountsOrder).reduce(
      (result, entry) => ({ ...result, [`${entry[0]}.order`]: entry[1] }),
      {}
    );

    return updateDoc(this.getDocRef(), {
      ...payload,
    });
  }

  private getDocRef(): DocumentReference {
    return doc(collection(this.firestore, 'accounts'), this.afAuth.currentUser?.uid);
  }
}
