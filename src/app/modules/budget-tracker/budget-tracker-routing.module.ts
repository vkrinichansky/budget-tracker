import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BudgetTrackerComponent } from './budget-tracker.component';
import { InitDataGuard } from './guards';
import { AppRoutesNames } from '@budget-tracker/utils';

const routes: Routes = [
  {
    path: '',
    component: BudgetTrackerComponent,
    canActivate: [InitDataGuard],
    children: [
      {
        path: AppRoutesNames.Dashboard,
        loadChildren: () => import('./modules/dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: AppRoutesNames.Statistics,
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BudgetTrackerRoutingModule {}
