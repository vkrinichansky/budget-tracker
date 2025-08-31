import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  browserLocalPersistence,
  User as FirebaseUser,
  getAdditionalUserInfo,
  GoogleAuthProvider,
  setPersistence,
  signInWithPopup,
  signOut,
} from '@angular/fire/auth';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, combineLatest, EMPTY, filter, switchMap, take, tap } from 'rxjs';
import { from, map, mergeMap } from 'rxjs';
import { User } from '../models';
import { AuthActions } from './auth.actions';
import { EventBusService } from '@budget-tracker/utils';
import { AuthEvents } from '../models';

@Injectable()
export class AuthEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly afAuth: Auth,
    private readonly eventBus: EventBusService
  ) {}

  readonly setUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.setUser),
      mergeMap(() =>
        authState(this.afAuth).pipe(
          filter((user) => !!user),
          take(1)
        )
      ),
      map((user) => AuthActions.authenticated({ user: this.extractUserFromState(user, true) }))
    )
  );

  readonly login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(() =>
        combineLatest([
          from(setPersistence(this.afAuth, browserLocalPersistence)),
          from(signInWithPopup(this.afAuth, new GoogleAuthProvider())),
        ]).pipe(
          map(([, user]) =>
            AuthActions.authenticated({
              user: this.extractUserFromState(
                user.user,
                getAdditionalUserInfo(user)?.isNewUser ?? false
              ),
            })
          ),
          tap(() =>
            this.eventBus.emit({
              type: AuthEvents.LOGIN,
              status: 'success',
            })
          ),
          catchError(() => {
            this.eventBus.emit({
              type: AuthEvents.LOGIN,
              status: 'error',
              errorCode: 'errors.auth.loginFailed',
            });

            return EMPTY;
          })
        )
      )
    )
  );

  readonly logOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() => from(signOut(this.afAuth))),
      map(() => AuthActions.notAuthenticated()),
      tap(() =>
        this.eventBus.emit({
          type: AuthEvents.LOGOUT,
          status: 'success',
        })
      ),
      catchError(() => {
        this.eventBus.emit({
          type: AuthEvents.LOGOUT,
          status: 'error',
          errorCode: 'errors.auth.logoutFailed',
        });

        return EMPTY;
      })
    )
  );

  private extractUserFromState(user: FirebaseUser, isNewUser: boolean): User {
    const userData: User = {
      displayName: user?.displayName as string,
      email: user?.email as string,
      uid: user?.uid as string,
      photoURL: user?.photoURL as string,
      isNewUser,
    };

    return userData;
  }
}
