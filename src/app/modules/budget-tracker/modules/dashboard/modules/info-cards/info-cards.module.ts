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
import { InfoCardValueModalService, RootValuesFacadeService, RootValuesService } from './services';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { rootValuesFeature } from './store/reducers';
import { RootValuesEffects } from './store/effects';

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
    StoreModule.forFeature(rootValuesFeature),
    EffectsModule.forFeature([RootValuesEffects]),
  ],
  exports: [
    IncomeInfoCardComponent,
    ExpenseInfoCardComponent,
    BalanceInfoCardComponent,
    SavingsInfoCardComponent,
    FreeMoneyInfoCardComponent,
  ],
  providers: [InfoCardValueModalService, RootValuesService, RootValuesFacadeService],
})
export class InfoCardsModule {}
