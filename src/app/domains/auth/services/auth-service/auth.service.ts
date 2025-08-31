import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { map, Observable, firstValueFrom } from 'rxjs';
import { AuthActions, AuthSelectors } from '../../store';
import { Store } from '@ngrx/store';
import { EventBusService } from '@budget-tracker/utils';
import { AuthEvents, User } from '../../models';

@Injectable()
export class AuthService {
  constructor(
    private readonly afAuth: Auth,
    private readonly store: Store,
    private readonly eventBus: EventBusService
  ) {}

  async initAuthState(): Promise<void> {
    const isLoaded = await firstValueFrom(this.store.select(AuthSelectors.authLoadedSelector));

    if (!isLoaded) {
      this.store.dispatch(AuthActions.setUser());
    }
  }

  async googleLogin(): Promise<void> {
    this.store.dispatch(AuthActions.login());

    return this.eventBus.waitFor(AuthEvents.LOGIN);
  }

  async logOut(): Promise<void> {
    this.store.dispatch(AuthActions.logout());

    return this.eventBus.waitFor(AuthEvents.LOGOUT);
  }

  setUser(): void {
    this.store.dispatch(AuthActions.setUser());
  }

  getUser(): Observable<User | null> {
    return this.store.select(AuthSelectors.userSelector);
  }

  isLoggedIn(): Observable<boolean> {
    return authState(this.afAuth).pipe(map((user) => !!user));
  }
}
