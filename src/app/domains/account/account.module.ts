import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { AccountEffects, accountsReducer, featureKey } from './store';
import { EffectsModule } from '@ngrx/effects';
import {
  AccountApiService,
  AccountServiceService,
  AccountsFacadeService,
  AccountModalService,
} from './services';
import {
  AddAccountModalComponent,
  AccountsListModalComponent,
  MoveMoneyBetweenAccountsModalComponent,
  AccountCardComponent,
  AccountsInfoCardComponent,
  FullBalanceInfoCardComponent,
} from './components';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MetadataModule } from '@budget-tracker/metadata';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    CommonModule,
    DesignSystemModule,
    ReactiveFormsModule,
    TranslateModule,
    MetadataModule,
    DragDropModule,

    StoreModule.forFeature(featureKey, accountsReducer),
    EffectsModule.forFeature([AccountEffects]),
  ],
  declarations: [
    MoveMoneyBetweenAccountsModalComponent,
    AccountsListModalComponent,
    AddAccountModalComponent,
    AccountCardComponent,
    AccountsInfoCardComponent,
    FullBalanceInfoCardComponent,
  ],
  exports: [AccountsInfoCardComponent, FullBalanceInfoCardComponent],
  providers: [
    AccountApiService,
    AccountsFacadeService,
    AccountModalService,
    AccountServiceService,
  ],
})
export class AccountDomainModule {}
