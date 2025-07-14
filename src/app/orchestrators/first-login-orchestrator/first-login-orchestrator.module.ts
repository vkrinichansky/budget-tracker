import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirstLoginOrchestratorService } from './first-login-orchestrator.service';
import { MetadataDomainModule } from '@budget-tracker/metadata';
import { CategoryDomainModule } from '@budget-tracker/category';

@NgModule({
  declarations: [],
  imports: [CommonModule, MetadataDomainModule, CategoryDomainModule],
  providers: [FirstLoginOrchestratorService],
})
export class FirstLoginOrchestratorModule {}
