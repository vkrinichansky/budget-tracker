import { NgModule } from '@angular/core';
import { RouterModule, Routes, provideRouter, withViewTransitions } from '@angular/router';
import { AuthGuard, SecureInnerPagesGuard } from './modules/auth/guards';
import { AppRoutesNames } from '@budget-tracker/utils';

const routes: Routes = [
  {
    path: AppRoutesNames.Auth,
    canActivate: [SecureInnerPagesGuard],
    loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthCoreModule),
  },
  {
    path: AppRoutesNames.BudgetTracker,
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/budget-tracker/budget-tracker.module').then((m) => m.BudgetTrackerModule),
  },
  {
    path: '',
    redirectTo: AppRoutesNames.BudgetTracker,
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: AppRoutesNames.BudgetTracker,
    pathMatch: 'full',
  },
];

@NgModule({
  exports: [RouterModule],
  providers: [provideRouter(routes, withViewTransitions({ skipInitialTransition: true }))],
})
export class AppRoutingModule {}
