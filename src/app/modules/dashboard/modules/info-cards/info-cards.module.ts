import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IncomeInfoCardComponent,
  ExpenseInfoCardComponent,
  CurrentMonthBalanceInfoCardComponent,
} from './components';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilsModule } from '@budget-tracker/utils';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MetadataModule } from '@budget-tracker/metadata';

@NgModule({
  declarations: [
    IncomeInfoCardComponent,
    ExpenseInfoCardComponent,
    CurrentMonthBalanceInfoCardComponent,
  ],
  imports: [
    CommonModule,
    DesignSystemModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    UtilsModule,
    DragDropModule,
    MetadataModule,
  ],
  exports: [
    IncomeInfoCardComponent,
    ExpenseInfoCardComponent,
    CurrentMonthBalanceInfoCardComponent,
  ],
})
export class InfoCardsModule {}
