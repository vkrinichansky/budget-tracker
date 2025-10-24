import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardOrchestratorManagerService } from './dashboard-orchestrator-manager.service';
import { CurrencyChangeOrchestratorModule } from '@budget-tracker/currency-change-orchestrator';
import { MoveMoneyBetweenAccountsOrchestratorModule } from '@budget-tracker/move-money-between-accounts-orchestrator';
import { ResetCategoriesOrchestratorModule } from '@budget-tracker/reset-categories-orchestrator';
import { CategoryTransactionOrchestratorModule } from '@budget-tracker/category-transaction-orchestrator';
import { RemoveActivityLogRecordOrchestratorModule } from '@budget-tracker/remove-activity-log-record-orchestrator';
import { EditAccountValueOrchestratorModule } from '@budget-tracker/edit-account-value-orchestrator';
import { MonthResetOrchestratorModule } from '@budget-tracker/month-reset-orchestrator';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CurrencyChangeOrchestratorModule,
    MoveMoneyBetweenAccountsOrchestratorModule,
    ResetCategoriesOrchestratorModule,
    CategoryTransactionOrchestratorModule,
    RemoveActivityLogRecordOrchestratorModule,
    EditAccountValueOrchestratorModule,
    MonthResetOrchestratorModule,
  ],
  providers: [DashboardOrchestratorManagerService],
})
export class DashboardOrchestratorConfigModule {}
