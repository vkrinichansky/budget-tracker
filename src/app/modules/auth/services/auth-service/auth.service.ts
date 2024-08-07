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
import { collection, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { getMonthAndYearString } from '@budget-tracker/utils';

@Injectable()
export class AuthService {
  constructor(
    private afAuth: Auth,
    private firestore: Firestore
  ) {}

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
    const userData: unknown = {
      budget: {
        categories: {},
        accounts: {},
        activityLog: [],
      },
      statistics: {
        snapshots: {},
      },
      resetDate: getMonthAndYearString(),
      shouldDoReset: true,
    };

    const userMetadata: unknown = {
      currency: 'usd',
      language: 'en-US',
    };

    await setDoc(doc(collection(this.firestore, `userData`), userId), userData);
    await setDoc(doc(collection(this.firestore, `userMetadata`), userId), userMetadata);
  }
}
