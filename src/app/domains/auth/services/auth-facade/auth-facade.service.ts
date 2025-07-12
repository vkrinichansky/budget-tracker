import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth-service/auth.service';
import { User } from '../../models';
@Injectable()
export class AuthFacadeService {
  constructor(private readonly authService: AuthService) {}

  async initAuthState(): Promise<void> {
    return await this.authService.initAuthState();
  }

  async googleLogin(): Promise<void> {
    return this.authService.googleLogin();
  }

  logOut(): void {
    this.authService.logOut();
  }

  isLoggedIn(): Observable<boolean> {
    return this.authService.isLoggedIn();
  }

  getUser(): Observable<User | null> {
    return this.authService.getUser();
  }

  async runLoginFlow(): Promise<void> {
    return this.authService.runLoginFlow();
  }
}
