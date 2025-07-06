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
import {
  expenseAdjustmentCategory,
  incomeAdjustmentCategory,
  Category,
} from '@budget-tracker/models';

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
    const metadata: Record<string, string> = {
      currency: 'usd',
      language: 'en-US',
      resetDate: getMonthAndYearString(),
    };

    const categories: Record<string, Category> = {
      [incomeAdjustmentCategory.id]: incomeAdjustmentCategory,
      [expenseAdjustmentCategory.id]: expenseAdjustmentCategory,
    };

    await setDoc(doc(collection(this.firestore, 'metadata'), userId), metadata);
    await setDoc(doc(collection(this.firestore, 'accounts'), userId), {});
    await setDoc(doc(collection(this.firestore, 'categories'), userId), categories);
    await setDoc(doc(collection(this.firestore, 'activityLog'), userId), {});
    await setDoc(doc(collection(this.firestore, 'snapshots'), userId), {});
  }
}
