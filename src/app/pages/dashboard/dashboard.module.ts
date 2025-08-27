import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardComponent } from './dashboard.component';
import { UtilsModule } from '@budget-tracker/utils';
import { MetadataDomainModule } from '@budget-tracker/metadata';
import { ActivityLogDomainModule } from '@budget-tracker/activity-log';
import { AccountDomainModule } from '@budget-tracker/account';
import { CategoryDomainModule } from '@budget-tracker/category';
import { CurrencyChangeOrchestratorModule } from '@budget-tracker/currency-change-orchestrator';
import { MoveMoneyBetweenAccountsOrchestratorModule } from '@budget-tracker/move-money-between-accounts-orchestrator';
import { ResetCategoriesOrchestratorModule } from '@budget-tracker/reset-categories-orchestrator';
import { ChangeCategoryValueOrchestratorModule } from '@budget-tracker/change-category-value-orchestrator';
import { RemoveAlRecordOrchestratorModule } from '@budget-tracker/remove-al-record-orchestrator';

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
    MetadataDomainModule,
    ActivityLogDomainModule,
    AccountDomainModule,
    CurrencyChangeOrchestratorModule,
    MoveMoneyBetweenAccountsOrchestratorModule,
    ResetCategoriesOrchestratorModule,
    ChangeCategoryValueOrchestratorModule,
    RemoveAlRecordOrchestratorModule,
  ],
})
export class DashboardPageModule {}
