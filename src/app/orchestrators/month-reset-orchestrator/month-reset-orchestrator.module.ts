import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthResetOrchestratorService } from './month-reset-orchestrator.service';
import { CategoryDomainModule } from '@budget-tracker/category';
import { AccountDomainModule } from '@budget-tracker/account';
import { SnapshotDomainModule } from '@budget-tracker/snapshot';
import { MetadataDomainModule } from '@budget-tracker/metadata';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CategoryDomainModule,
    AccountDomainModule,
    SnapshotDomainModule,
    MetadataDomainModule,
  ],
  providers: [MonthResetOrchestratorService],
})
export class MonthResetOrchestratorModule {}
