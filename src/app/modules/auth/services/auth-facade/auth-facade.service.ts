import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, firstValueFrom, map } from 'rxjs';
import { Observable } from 'rxjs';
import { AuthService } from '../auth-service/auth.service';
import { AuthActions, AuthSelectors } from '../../store';
import { User } from '../../models';

@Injectable()
export class AuthFacadeService {
  constructor(
    private store: Store,
    private authService: AuthService
  ) {}

  googleLogin(): void {
    this.store.dispatch(AuthActions.login());
  }

  logOut(): void {
    this.store.dispatch(AuthActions.logout());
  }

  getUser(): void {
    this.store.dispatch(AuthActions.getUser());
  }

  getUserFromState(): Observable<User> {
    return this.store.select(AuthSelectors.userSelector).pipe(filter((user) => !!user));
  }

  getUserId(): Observable<string> {
    return this.getUserFromState().pipe(map((user) => user.uid));
  }

  isLoggedIn(): Observable<boolean> {
    return this.authService.isLoggedIn();
  }

  async initAuthState(): Promise<void> {
    const isLoaded = await firstValueFrom(this.store.select(AuthSelectors.authLoadedSelector));

    if (!isLoaded) {
      this.store.dispatch(AuthActions.getUser());
    }
  }

  getAuthLoading(): Observable<boolean> {
    return this.store.select(AuthSelectors.authLoadingSelector);
  }
}
