import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, UserCredential, authState } from '@angular/fire/auth';
import { setPersistence, browserLocalPersistence } from '@firebase/auth';
import { map, Observable } from 'rxjs';
import { AppState } from '@budget-tracker/shared';
import { addDoc, collection, doc, Firestore, setDoc } from '@angular/fire/firestore';

@Injectable()
export class AuthService {
  constructor(private afAuth: Auth, private firestore: Firestore) {}

  async googleLogin(): Promise<UserCredential> {
    await setPersistence(this.afAuth, browserLocalPersistence);
    return await signInWithPopup(this.afAuth, new GoogleAuthProvider());
  }

  async logOut(): Promise<void> {
    return await signOut(this.afAuth);
  }

  isLoggedIn(): Observable<boolean> {
    return authState(this.afAuth).pipe(map((user) => !!user));
  }

  async setUserData(userId: string): Promise<void> {
    const userDataCollection = collection(this.firestore, `userData`);

    const data: AppState = {
      income: [],
      expense: [],
      balance: 0,
      accumulation: 0,
      free: 0,
    };

    return await setDoc(doc(userDataCollection, userId), data);
  }
}
