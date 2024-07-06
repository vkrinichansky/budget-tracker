import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthFacadeService } from '../../services';
import { NavigatorService } from '@budget-tracker/utils';

@Injectable()
export class SecureInnerPagesGuard {
  constructor(
    private authFacade: AuthFacadeService,
    private navigator: NavigatorService
  ) {}

  canActivate(): Observable<boolean> {
    return this.authFacade.isLoggedIn().pipe(
      map((isLoggedIn) => {
        if (!isLoggedIn) {
          return true;
        }

        this.navigator.navigateToBudgetTracker();
        return false;
      })
    );
  }
}
