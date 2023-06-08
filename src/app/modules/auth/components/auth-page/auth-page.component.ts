import { Component, HostBinding, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthFacadeService } from '../../services';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
})
export class AuthPageComponent implements OnInit {
  private readonly rootTranslationKey = 'auth';

  @HostBinding('class')
  private readonly classes = 'flex justify-center items-center flex-col w-full h-full bg-charcoal gap-y-10';

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
