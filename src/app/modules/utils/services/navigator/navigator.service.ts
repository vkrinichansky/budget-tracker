import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '@budget-tracker/models';

@Injectable({ providedIn: 'root' })
export class NavigatorService {
  private readonly router = inject(Router);

  navigateToAuthPage(): void {
    this.router.navigate([AppRoutes.Auth]);
  }

  navigateToDashboard(): void {
    this.router.navigate([AppRoutes.Dashboard]);
  }
}
