import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryTransactionOrchestratorService } from './category-transaction-orchestrator.service';
import { CategoryTransactionModalComponent } from './components';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CategoryTransactionModalComponent],
  imports: [CommonModule, DesignSystemModule, TranslateModule, FormsModule, ReactiveFormsModule],
  providers: [CategoryTransactionOrchestratorService],
})
export class CategoryTransactionOrchestratorModule {}
