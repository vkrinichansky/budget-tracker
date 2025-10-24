import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthFacadeService } from '@budget-tracker/auth';
import { SnackbarHandlerService } from '@budget-tracker/design-system';
import { getErrorMessage, NavigatorService } from '@budget-tracker/shared-utils';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-login-button',
  templateUrl: './login-button.component.html',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginButtonComponent {
  readonly loading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly authFacade: AuthFacadeService,
    private readonly snackbarHandler: SnackbarHandlerService,
    private readonly navigator: NavigatorService
  ) {}

  async login(): Promise<void> {
    try {
      this.loading$.next(true);

      await this.authFacade.googleLogin();
      this.navigator.navigateToDashboard();
    } catch (error) {
      this.snackbarHandler.showErrorSnackbar(getErrorMessage(error));
    } finally {
      this.loading$.next(false);
    }
  }
}
