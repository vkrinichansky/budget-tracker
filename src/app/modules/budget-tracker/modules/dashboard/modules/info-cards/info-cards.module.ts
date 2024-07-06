import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IncomeInfoCardComponent,
  ExpenseInfoCardComponent,
  BalanceInfoCardComponent,
  AccountsInfoCardComponent,
  AccountsListModalComponent,
  AccountCardComponent,
  AccountValueEditModalComponent,
} from './components';
import { AccountsListModalService, AccountsValueEditModalService } from './services';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataModule } from '@budget-tracker/data';
import { SharedModule } from '@budget-tracker/shared';
import { UtilsModule } from '@budget-tracker/utils';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    IncomeInfoCardComponent,
    ExpenseInfoCardComponent,
    BalanceInfoCardComponent,
    AccountsInfoCardComponent,
    AccountsListModalComponent,
    AccountCardComponent,
    AccountValueEditModalComponent,
  ],
  imports: [
    CommonModule,
    DesignSystemModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    DataModule,
    SharedModule,
    UtilsModule,
  ],
  exports: [
    IncomeInfoCardComponent,
    ExpenseInfoCardComponent,
    BalanceInfoCardComponent,
    AccountsInfoCardComponent,
    AccountsListModalComponent,
    AccountCardComponent,
  ],
  providers: [AccountsValueEditModalService, AccountsListModalService],
})
export class InfoCardsModule {}
