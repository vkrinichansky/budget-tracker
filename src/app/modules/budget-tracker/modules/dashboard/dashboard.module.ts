import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { TranslateModule } from '@ngx-translate/core';
import { ActivityLogModule, CategoriesModule, InfoCardsModule } from './modules';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '@budget-tracker/shared';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
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
    SharedModule,
  ],
})
export class DashboardModule {}
