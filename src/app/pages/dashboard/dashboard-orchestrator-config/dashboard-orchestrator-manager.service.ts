import { inject, Injectable } from '@angular/core';
import { CurrencyChangeOrchestratorService } from '@budget-tracker/currency-change-orchestrator';
import {
  BaseOrchestratorManager,
  BaseOrchestratorService,
} from '@budget-tracker/orchestrators-utils';
import { MoveMoneyBetweenAccountsOrchestratorService } from '@budget-tracker/move-money-between-accounts-orchestrator';
import { ResetCategoriesOrchestratorService } from '@budget-tracker/reset-categories-orchestrator';
import { CategoryTransactionOrchestratorService } from '@budget-tracker/category-transaction-orchestrator';
import { RemoveActivityLogRecordOrchestratorService } from '@budget-tracker/remove-activity-log-record-orchestrator';
import { EditAccountValueOrchestratorService } from '@budget-tracker/edit-account-value-orchestrator';

@Injectable()
export class DashboardOrchestratorManagerService extends BaseOrchestratorManager {
  protected readonly orchestrators: BaseOrchestratorService[] = [
    inject(CurrencyChangeOrchestratorService),
    inject(MoveMoneyBetweenAccountsOrchestratorService),
    inject(ResetCategoriesOrchestratorService),
    inject(CategoryTransactionOrchestratorService),
    inject(RemoveActivityLogRecordOrchestratorService),
    inject(EditAccountValueOrchestratorService),
  ];
}
