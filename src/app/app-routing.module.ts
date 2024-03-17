import { NgModule } from '@angular/core';
import { RouterModule, Routes, provideRouter, withViewTransitions } from '@angular/router';
import { AuthGuard, SecureInnerPagesGuard } from './modules/auth/guards';

const routes: Routes = [
  {
    path: 'auth',
    canActivate: [SecureInnerPagesGuard],
    loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthCoreModule),
  },
  {
    path: 'budget-tracker',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/budget-tracker/budget-tracker.module').then((m) => m.BudgetTrackerModule),
  },
  {
    path: '',
    redirectTo: 'budget-tracker',
    pathMatch: 'full',
  },
];

@NgModule({
  exports: [RouterModule],
  providers: [provideRouter(routes, withViewTransitions({ skipInitialTransition: true }))],
})
export class AppRoutingModule {}
