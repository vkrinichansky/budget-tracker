import { NgModule } from '@angular/core';
import { RouterModule, Routes, provideRouter, withViewTransitions } from '@angular/router';
import { AuthGuard, SecureInnerPagesGuard } from './modules/auth/guards';
import { AppRoutes } from '@budget-tracker/models';

const routes: Routes = [
  {
    path: AppRoutes.Auth,
    canActivate: [SecureInnerPagesGuard],
    loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthCoreModule),
  },
  {
    path: AppRoutes.Dashboard,
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/dashboard/dashboard.module').then((m) => m.DashboardModule),
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
