import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { AccountsEffects, ActivityLogEffects, CategoriesEffects, DataInitEffects, featureKey, reducers } from './store';
import {
  AccountsFacadeService,
  AccountsService,
  ActivityLogFacadeService,
  ActivityLogService,
  CategoriesFacadeService,
  CategoriesService,
  DataInitFacadeService,
  DataInitService,
  StatisticsFacadeService,
} from './services';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(featureKey, reducers),
    EffectsModule.forFeature([CategoriesEffects, DataInitEffects, ActivityLogEffects, AccountsEffects]),
  ],
  providers: [
    ActivityLogFacadeService,
    CategoriesFacadeService,
    CategoriesService,
    DataInitService,
    DataInitFacadeService,
    StatisticsFacadeService,
    ActivityLogService,
    AccountsFacadeService,
    AccountsService,
  ],
})
export class DataModule {}
