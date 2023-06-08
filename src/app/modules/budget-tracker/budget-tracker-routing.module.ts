import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BudgetTrackerComponent } from './budget-tracker.component';
import { InitDataGuard } from './guards';

const routes: Routes = [
  {
    path: '',
    component: BudgetTrackerComponent,
    canActivate: [InitDataGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./modules/dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BudgetTrackerRoutingModule {}
