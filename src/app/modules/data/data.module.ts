import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import {
  AccountsEffects,
  ActivityLogEffects,
  CategoriesEffects,
  DataInitEffects,
  featureKey,
  MetadataEffects,
  reducers,
} from './store';
import {
  AccountsFacadeService,
  AccountsService,
  ActivityLogFacadeService,
  ActivityLogService,
  CategoriesFacadeService,
  CategoriesService,
  DataInitFacadeService,
  DataInitService,
  MetadataFacadeService,
  MetadataService,
  StatisticsFacadeService,
} from './services';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(featureKey, reducers),
    EffectsModule.forFeature([
      CategoriesEffects,
      DataInitEffects,
      ActivityLogEffects,
      AccountsEffects,
      MetadataEffects,
    ]),
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
    MetadataFacadeService,
    MetadataService,
  ],
})
export class DataModule {}
