import { inject, Injectable } from '@angular/core';
import { AuthFacadeService } from '@budget-tracker/auth';
import { DataInitFacadeService } from '@budget-tracker/data';
import { combineLatest, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InitDataGuard {
  private readonly authFacade = inject(AuthFacadeService);

  constructor(private dataInitFacade: DataInitFacadeService) {}

  canActivate(): Observable<boolean> {
    return combineLatest([this.authFacade.isLoggedIn(), this.dataInitFacade.isDataLoaded()]).pipe(
      map(([isLoggedIn, isDataLoaded]) => {
        if (isLoggedIn && !isDataLoaded) {
          this.dataInitFacade.initData();
        }

        return true;
      })
    );
  }
}
