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
  MoveMoneyBetweenAccountsModalComponent,
} from './components';
import {
  AccountsListModalService,
  AccountsModalsService,
  AccountsValueEditModalService,
  AddAccountModalService,
} from './services';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataModule } from '@budget-tracker/data';
import { UtilsModule } from '@budget-tracker/utils';
import { DragDropModule } from '@angular/cdk/drag-drop';

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
    MoveMoneyBetweenAccountsModalComponent,
  ],
  imports: [
    CommonModule,
    DesignSystemModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    DataModule,
    UtilsModule,
    DragDropModule,
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
    MoveMoneyBetweenAccountsModalComponent,
  ],
  providers: [
    AccountsValueEditModalService,
    AccountsListModalService,
    AddAccountModalService,
    AccountsModalsService,
  ],
})
export class InfoCardsModule {}
