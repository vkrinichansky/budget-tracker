import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { AccountEffects, accountReducer, featureKey } from './store';
import { EffectsModule } from '@ngrx/effects';
import {
  AccountApiService,
  AccountService,
  AccountFacadeService,
  AccountModalService,
} from './services';
import {
  AddAccountModalComponent,
  AccountsListModalComponent,
  MoveMoneyBetweenAccountsModalComponent,
  AccountCardComponent,
  AccountsInfoCardComponent,
  FullBalanceInfoCardComponent,
  EditAccountValueModalComponent,
} from './components';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MetadataDomainModule } from '@budget-tracker/metadata';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    CommonModule,
    DesignSystemModule,
    ReactiveFormsModule,
    TranslateModule,
    MetadataDomainModule,
    DragDropModule,
    StoreModule.forFeature(featureKey, accountReducer),
    EffectsModule.forFeature([AccountEffects]),
  ],
  declarations: [
    MoveMoneyBetweenAccountsModalComponent,
    AccountsListModalComponent,
    AddAccountModalComponent,
    AccountCardComponent,
    AccountsInfoCardComponent,
    FullBalanceInfoCardComponent,
    EditAccountValueModalComponent,
  ],
  exports: [AccountsInfoCardComponent, FullBalanceInfoCardComponent],
  providers: [AccountApiService, AccountFacadeService, AccountModalService, AccountService],
})
export class AccountDomainModule {}
