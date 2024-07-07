import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IncomeInfoCardComponent,
  ExpenseInfoCardComponent,
  AccountsInfoCardComponent,
  AccountsListModalComponent,
  AccountCardComponent,
  AccountValueEditModalComponent,
  AddAccountModalComponent,
  FullBalanceInfoCardComponent,
  CurrentMonthBalanceInfoCardComponent,
} from './components';
import { AccountsListModalService, AccountsValueEditModalService, AddAccountModalService } from './services';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataModule } from '@budget-tracker/data';
import { UtilsModule } from '@budget-tracker/utils';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    IncomeInfoCardComponent,
    ExpenseInfoCardComponent,
    FullBalanceInfoCardComponent,
    AccountsInfoCardComponent,
    AccountsListModalComponent,
    AccountCardComponent,
    AccountValueEditModalComponent,
    AddAccountModalComponent,
    CurrentMonthBalanceInfoCardComponent,
  ],
  imports: [
    CommonModule,
    DesignSystemModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    DataModule,
    UtilsModule,
  ],
  exports: [
    IncomeInfoCardComponent,
    ExpenseInfoCardComponent,
    FullBalanceInfoCardComponent,
    AccountsInfoCardComponent,
    AccountsListModalComponent,
    AccountCardComponent,
    AddAccountModalComponent,
    CurrentMonthBalanceInfoCardComponent,
  ],
  providers: [AccountsValueEditModalService, AccountsListModalService, AddAccountModalService],
})
export class InfoCardsModule {}
