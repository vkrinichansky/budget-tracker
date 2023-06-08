import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IncomeInfoCardComponent,
  ExpenseInfoCardComponent,
  BalanceInfoCardComponent,
  SavingsInfoCardComponent,
  FreeMoneyInfoCardComponent,
  InfoCardValueModalComponent,
} from './components';
import { InfoCardValueModalService } from './services';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    IncomeInfoCardComponent,
    ExpenseInfoCardComponent,
    BalanceInfoCardComponent,
    SavingsInfoCardComponent,
    FreeMoneyInfoCardComponent,
    InfoCardValueModalComponent,
  ],
  imports: [
    CommonModule,
    DesignSystemModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
  ],
  exports: [
    IncomeInfoCardComponent,
    ExpenseInfoCardComponent,
    BalanceInfoCardComponent,
    SavingsInfoCardComponent,
    FreeMoneyInfoCardComponent,
  ],
  providers: [InfoCardValueModalService],
})
export class InfoCardsModule {}
