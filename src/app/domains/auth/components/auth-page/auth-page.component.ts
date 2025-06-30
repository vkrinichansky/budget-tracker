import { Component, HostBinding, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthFacadeService } from '../../services';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class AuthPageComponent implements OnInit {
  @HostBinding('class')
  private readonly classes =
    'flex justify-center items-center flex-col w-full h-full bg-charcoal gap-y-50';

  authLoading$: Observable<boolean>;

  constructor(private readonly authFacade: AuthFacadeService) {}

  ngOnInit(): void {
    this.authLoading$ = this.authFacade.getAuthLoading();
  }

  googleLogin() {
    this.authFacade.googleLogin();
  }
}
