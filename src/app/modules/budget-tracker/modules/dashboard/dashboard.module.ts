import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { TranslateModule } from '@ngx-translate/core';
import { ActivityLogModule, CategoriesModule, InfoCardsModule } from './modules';
import { DashboardComponent } from './dashboard.component';
import { BudgetTrackerFacadeService, BudgetTrackerService } from './services';
import { InitDataGuard } from './guards';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [InitDataGuard],
  },
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DesignSystemModule,
    TranslateModule,
    InfoCardsModule,
    ActivityLogModule,
    CategoriesModule,
  ],
  providers: [BudgetTrackerService, BudgetTrackerFacadeService, InitDataGuard],
})
export class DashboardModule {}
