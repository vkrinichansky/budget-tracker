import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {
  BalanceInfoCardComponent,
  DashboardComponent,
  ExpenseInfoCardComponent,
  FreeMoneyInfoCardComponent,
  IncomeInfoCardComponent,
  SavingsInfoCardComponent,
} from './components';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
];

@NgModule({
  declarations: [
    DashboardComponent,
    IncomeInfoCardComponent,
    ExpenseInfoCardComponent,
    BalanceInfoCardComponent,
    SavingsInfoCardComponent,
    FreeMoneyInfoCardComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(routes), DesignSystemModule, TranslateModule],
})
export class DashboardModule {}
