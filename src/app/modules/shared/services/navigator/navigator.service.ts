import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '../../models';

@Injectable()
export class NavigatorService {
  constructor(private router: Router) {}

  navigateToAuthPage(): void {
    this.router.navigate([AppRoutes.Auth]);
  }

  navigateToDashboard(): void {
    this.router.navigate([AppRoutes.Dashboard]);
  }

  navigateToBudgetTracker(): void {
    this.router.navigate([AppRoutes.BudgetTracker]);
  }
}
