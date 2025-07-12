import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirstLoginOrchestratorService } from './first-login-orchestrator/first-login-orchestrator.service';
import { MetadataDomainModule } from '@budget-tracker/metadata';
import { AccountDomainModule } from '@budget-tracker/account';
import { CategoryDomainModule } from '@budget-tracker/category';
import { ActivityLogDomainModule } from '@budget-tracker/activity-log';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MetadataDomainModule,
    AccountDomainModule,
    CategoryDomainModule,
    ActivityLogDomainModule,
  ],
  providers: [FirstLoginOrchestratorService],
})
export class FirstLoginOrchestratorModule {}
