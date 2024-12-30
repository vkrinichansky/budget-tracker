import { inject, Injectable } from '@angular/core';
import { AuthFacadeService } from '@budget-tracker/auth';
import { DataInitFacadeService } from '@budget-tracker/data';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InitDataGuard {
  private readonly authFacade = inject(AuthFacadeService);
  constructor(private dataInitFacade: DataInitFacadeService) {}

  canActivate(): Observable<boolean> {
    return this.authFacade.isLoggedIn().pipe(
      map((isLoggedIn) => {
        if (isLoggedIn) {
          this.dataInitFacade.initData();
          return true;
        }

        return false;
      })
    );
  }
}
