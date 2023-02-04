import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { Observable } from 'rxjs';
import { AuthActions, AuthSelectors } from '../../../store';

@Injectable()
export class AuthFacadeService {
  constructor(private store: Store) {}

  googleLogin(): void {
    this.store.dispatch(AuthActions.login());
  }

  logOut(): void {
    this.store.dispatch(AuthActions.logout());
  }

  getUser(): void {
    this.store.dispatch(AuthActions.getUser());
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
