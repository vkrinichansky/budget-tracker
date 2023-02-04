import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, UserCredential, authState } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { setPersistence, browserLocalPersistence } from '@firebase/auth';
import { map, Observable } from 'rxjs';
import { AppState } from '@budget-tracker/shared';

@Injectable()
export class AuthService {
  constructor(private afAuth: Auth) {}

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

  async setUserData(userId: string): Promise<any> {
    // const db = this.firestore.doc(`usersData/${userId}`);
    // const data: AppState = {
    //   income: [],
    //   expense: [],
    //   balance: 0,
    //   accumulation: 0,
    //   free: 0,
    // };
    // return await db.set(data, { merge: true });
  }
}
