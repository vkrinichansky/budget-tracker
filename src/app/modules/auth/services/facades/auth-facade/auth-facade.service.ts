import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { Observable } from 'rxjs';
import { AuthActions, AuthSelectors } from '../../../store';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class AuthFacadeService {
  constructor(private store: Store, private authService: AuthService) {}

  googleLogin(): void {
    this.store.dispatch(AuthActions.login());
  }

  logOut(): void {
    this.store.dispatch(AuthActions.logout());
  }

  getUser(): void {
    this.store.dispatch(AuthActions.getUser());
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
