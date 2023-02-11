import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
    loadChildren: () => import('./modules/main-page/budget-tracker.module').then((m) => m.BudgetTrackerModule),
  },
  {
    path: '',
    redirectTo: 'budget-tracker',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
