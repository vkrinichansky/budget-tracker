import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { User as FirebaseUser } from '@angular/fire/auth';
import { NavigatorService, SnackbarHandlerService } from '@budget-tracker/shared';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserCredential } from 'firebase/auth';
import { catchError, filter, of, take, tap } from 'rxjs';
import { from, map, mergeMap } from 'rxjs';
import { User } from '../../models';
import { AuthService } from '../../services';
import { AuthActions } from '../actions';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private afAuth: Auth,
    private navigator: NavigatorService,
    private snackbarHandler: SnackbarHandlerService
  ) {}

  getUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.getUser),
      mergeMap(() =>
        this.authService.getAuthState().pipe(
          filter((user) => !!user),
          take(1)
        )
      ),
      map((user) => AuthActions.authenticated({ user: this.extractUserFromState(user) }))
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(() => from(this.authService.googleLogin())),
      map((user) =>
        this.authService.getAdditionalUserInfo(user)?.isNewUser
          ? AuthActions.initDatabaseOnFirstLogin({ user: this.extractUserFromResponse(user) })
          : AuthActions.authenticated({ user: this.extractUserFromResponse(user) })
      ),
      catchError(() => {
        this.snackbarHandler.showErrorSnackbar();
        return of(AuthActions.loginFailed());
      })
    )
  );

  initDatabaseOnFirstLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initDatabaseOnFirstLogin),
      tap(() => console.log('AuthActions.initDatabaseOnFirstLogin')),
      mergeMap((action) =>
        from(this.authService.setUserData(action.user.uid)).pipe(
          map(() => AuthActions.authenticated({ user: action.user }))
        )
      ),
      catchError(() => {
        this.snackbarHandler.showErrorSnackbar();
        return of(AuthActions.loginFailed());
      })
    )
  );

  logOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      mergeMap(() => from(this.authService.logOut())),
      map(() => AuthActions.notAuthenticated())
    )
  );

  navigateToAuthPage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.notAuthenticated),
        map(() => this.navigator.navigateToAuthPage())
      ),
    { dispatch: false }
  );

  navigateToMainPage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.authenticated),
        map(() => this.navigator.navigateToDashboard())
      ),
    { dispatch: false }
  );

  private extractUserFromState(user: FirebaseUser | null): User {
    const userData: User = {
      displayName: user?.displayName as string,
      email: user?.email as string,
      uid: user?.uid as string,
      photoURL: user?.photoURL as string,
    };

    return userData;
  }

  private extractUserFromResponse(user: UserCredential): User {
    const userData: User = {
      displayName: user.user.displayName as string,
      email: user?.user.email as string,
      uid: user?.user.uid as string,
      photoURL: user?.user.photoURL as string,
    };

    return userData;
  }
}
