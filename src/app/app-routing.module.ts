import { NgModule } from '@angular/core';
import { RouterModule, Routes, provideRouter, withViewTransitions } from '@angular/router';
import { AppRoutes } from '@budget-tracker/shared-models';
import { AuthGuard, SecureInnerPagesGuard } from '@budget-tracker/auth';

const routes: Routes = [
  {
    path: AppRoutes.AUTH,
    canActivate: [SecureInnerPagesGuard],
    loadChildren: () => import('@budget-tracker/auth-page').then((m) => m.AuthPageModule),
  },
  {
    path: AppRoutes.DASHBOARD,
    canActivate: [AuthGuard],
    loadChildren: () => import('@budget-tracker/dashboard-page').then((m) => m.DashboardPageModule),
  },
  {
    path: AppRoutes.STATISTICS,
    canActivate: [AuthGuard],
    loadChildren: () => import('@budget-tracker/statistics-page').then((m) => m.StatisticsModule),
  },
  {
    path: '',
    redirectTo: AppRoutes.DASHBOARD,
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: AppRoutes.DASHBOARD,
    pathMatch: 'full',
  },
];

@NgModule({
  exports: [RouterModule],
  providers: [provideRouter(routes, withViewTransitions({ skipInitialTransition: true }))],
})
export class AppRoutingModule {}
