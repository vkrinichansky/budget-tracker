import { Injectable } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  UserCredential,
  authState,
  User,
  getAdditionalUserInfo,
  AdditionalUserInfo,
} from '@angular/fire/auth';
import { setPersistence, browserLocalPersistence } from '@firebase/auth';
import { map, Observable } from 'rxjs';
import { BudgetTrackerState } from '@budget-tracker/shared';
import { collection, CollectionReference, doc, DocumentData, Firestore, setDoc } from '@angular/fire/firestore';

@Injectable()
export class AuthService {
  userDataCollection: CollectionReference<DocumentData>;

  constructor(private afAuth: Auth, private firestore: Firestore) {
    this.userDataCollection = collection(this.firestore, `userData`);
  }

  async googleLogin(): Promise<UserCredential> {
    await setPersistence(this.afAuth, browserLocalPersistence);
    return await signInWithPopup(this.afAuth, new GoogleAuthProvider());
  }

  async logOut(): Promise<void> {
    return await signOut(this.afAuth);
  }

  getAuthState(): Observable<User | null> {
    return authState(this.afAuth);
  }

  isLoggedIn(): Observable<boolean> {
    return this.getAuthState().pipe(map((user) => !!user));
  }

  getAdditionalUserInfo(user: UserCredential): AdditionalUserInfo | null {
    return getAdditionalUserInfo(user);
  }

  async setUserData(userId: string): Promise<void> {
    const data: BudgetTrackerState = {
      income: [],
      expense: [],
      balance: 0,
      savings: 0,
      free: 0,
      activityLog: [],
    };

    return await setDoc(doc(this.userDataCollection, userId), data);
  }
}
