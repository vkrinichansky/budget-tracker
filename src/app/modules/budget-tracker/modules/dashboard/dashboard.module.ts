import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {
  ActivityLogComponent,
  BalanceInfoCardComponent,
  DashboardComponent,
  ExpenseInfoCardComponent,
  FreeMoneyInfoCardComponent,
  IncomeInfoCardComponent,
  InfoCardValueModalComponent,
  RootValueChangeRecordComponent,
  SavingsInfoCardComponent,
} from './components';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InfoCardValueModalService } from './services';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    InfoCardValueModalComponent,
    ActivityLogComponent,
    RootValueChangeRecordComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DesignSystemModule,
    TranslateModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
  ],
  providers: [InfoCardValueModalService],
})
export class DashboardModule {}
