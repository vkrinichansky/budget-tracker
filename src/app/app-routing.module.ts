import { NgModule } from '@angular/core';
import { RouterModule, Routes, provideRouter, withViewTransitions } from '@angular/router';
import { AppRoutes } from '@budget-tracker/shared-models';
import { AuthGuard, SecureInnerPagesGuard } from '@budget-tracker/auth';

const routes: Routes = [
  {
    path: AppRoutes.Auth,
    canActivate: [SecureInnerPagesGuard],
    loadChildren: () => import('@budget-tracker/auth-page').then((m) => m.AuthPageModule),
  },
  {
    path: AppRoutes.Dashboard,
    canActivate: [AuthGuard],
    loadChildren: () => import('@budget-tracker/dashboard-page').then((m) => m.DashboardPageModule),
  },
  {
    path: AppRoutes.Statistics,
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/statistics/statistics.module').then((m) => m.StatisticsModule),
  },
  {
    path: '',
    redirectTo: AppRoutes.Dashboard,
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: AppRoutes.Dashboard,
    pathMatch: 'full',
  },
];

@NgModule({
  exports: [RouterModule],
  providers: [provideRouter(routes, withViewTransitions({ skipInitialTransition: true }))],
})
export class AppRoutingModule {}
