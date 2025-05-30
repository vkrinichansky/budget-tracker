import { Injectable } from '@angular/core';
import { User as FirebaseUser } from '@angular/fire/auth';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, of, switchMap, take, tap } from 'rxjs';
import { from, map, mergeMap } from 'rxjs';
import { User } from '@budget-tracker/models';
import { AuthService } from '../../services';
import { AuthActions } from '../actions';
import { NavigatorService } from '@budget-tracker/utils';
import { SnackbarHandlerService } from '@budget-tracker/design-system';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
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
      switchMap(() => from(this.authService.googleLogin())),
      map((user) =>
        this.authService.getAdditionalUserInfo(user)?.isNewUser
          ? AuthActions.initDatabaseOnFirstLogin({ user: this.extractUserFromState(user.user) })
          : AuthActions.authenticated({
              user: this.extractUserFromState(user.user),
              shouldRedirect: true,
            })
      ),
      catchError(() => {
        this.snackbarHandler.showGeneralErrorSnackbar();
        return of(AuthActions.loginFailed());
      })
    )
  );

  initDatabaseOnFirstLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initDatabaseOnFirstLogin),
      switchMap((action) =>
        from(this.authService.setUserData(action.user.uid)).pipe(
          map(() => AuthActions.authenticated({ user: action.user, shouldRedirect: true }))
        )
      ),
      catchError(() => {
        this.snackbarHandler.showGeneralErrorSnackbar();
        return of(AuthActions.loginFailed());
      })
    )
  );

  logOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() => from(this.authService.logOut())),
      map(() => AuthActions.notAuthenticated())
    )
  );

  navigateToAuthPage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.notAuthenticated),
        tap(() => this.navigator.navigateToAuthPage())
      ),
    { dispatch: false }
  );

  navigateToMainPage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.authenticated),
        filter((action) => !!action?.shouldRedirect),
        tap(() => this.navigator.navigateToDashboard())
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
}
