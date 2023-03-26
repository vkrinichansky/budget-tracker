import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthFacadeService } from '../../services';
@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss'],
})
export class AuthPageComponent implements OnInit {
  private readonly rootTranslationKey = 'auth';

  authLoading$: Observable<boolean>;

  constructor(private authFacade: AuthFacadeService) {}

  ngOnInit(): void {
    this.authLoading$ = this.authFacade.getAuthLoading();
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }

  googleLogin() {
    this.authFacade.googleLogin();
  }
}
