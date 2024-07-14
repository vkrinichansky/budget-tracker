import { NgModule } from '@angular/core';
import { RouterModule, Routes, provideRouter, withViewTransitions } from '@angular/router';
import { AuthGuard, SecureInnerPagesGuard } from './modules/auth/guards';
import { AppRoutesNames } from '@budget-tracker/utils';
import { InitDataGuard } from './guards';

const routes: Routes = [
  {
    path: AppRoutesNames.Auth,
    canActivate: [SecureInnerPagesGuard],
    loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthCoreModule),
  },
  {
    path: AppRoutesNames.Dashboard,
    canActivate: [AuthGuard, InitDataGuard],
    loadChildren: () => import('./modules/dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: AppRoutesNames.Statistics,
    canActivate: [AuthGuard, InitDataGuard],
    loadChildren: () => import('./modules/statistics/statistics.module').then((m) => m.StatisticsModule),
  },
  {
    path: '',
    redirectTo: AppRoutesNames.Dashboard,
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: AppRoutesNames.Dashboard,
    pathMatch: 'full',
  },
];

@NgModule({
  exports: [RouterModule],
  providers: [provideRouter(routes, withViewTransitions({ skipInitialTransition: true }))],
})
export class AppRoutingModule {}
