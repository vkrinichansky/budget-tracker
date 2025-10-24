import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoveMoneyBetweenAccountsOrchestratorService } from './move-money-between-accounts-orchestrator.service';
@NgModule({
  imports: [CommonModule],
  providers: [MoveMoneyBetweenAccountsOrchestratorService],
})
export class MoveMoneyBetweenAccountsOrchestratorModule {}
