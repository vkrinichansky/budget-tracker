import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardComponent } from './dashboard.component';
import { UtilsModule } from '@budget-tracker/utils';
import { MetadataModule } from '@budget-tracker/metadata';
import { ActivityLogDomainModule } from '@budget-tracker/activity-log';
import { AccountDomainModule } from '@budget-tracker/account';
import { CategoryDomainModule } from '@budget-tracker/category';

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
    CategoryDomainModule,
    UtilsModule,
    MetadataModule,
    ActivityLogDomainModule,
    AccountDomainModule,
  ],
})
export class DashboardModule {}
