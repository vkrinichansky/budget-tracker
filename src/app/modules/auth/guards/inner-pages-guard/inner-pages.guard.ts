import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthService } from '../../services';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SecureInnerPagesGuard  {
  constructor(public authService: AuthService, public router: Router) {}
  canActivate(): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      map((isLoggedIn) => {
        if (!isLoggedIn) {
          return true;
        } else {
          this.router.navigate(['budget-tracker']);
          return false;
        }
      })
    );
  }
}
