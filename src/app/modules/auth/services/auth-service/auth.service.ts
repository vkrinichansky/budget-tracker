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
  CurrenciesEnum,
  Dashboard,
  LanguagesEnum,
  Snapshots,
  UserMetadata,
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
    const metadata: UserMetadata = {
      currency: CurrenciesEnum.USD,
      language: LanguagesEnum.English,
    };

    const dashboard: Dashboard = {
      accounts: {},
      categories: {},
      activityLog: [],
      resetDate: getMonthAndYearString(),
    };

    const snapshots: Snapshots = {
      snapshots: {},
    };

    await setDoc(doc(collection(this.firestore, 'metadata'), userId), metadata);
    await setDoc(doc(collection(this.firestore, 'dashboard'), userId), dashboard);
    await setDoc(doc(collection(this.firestore, 'snapshots'), userId), snapshots);
  }
}
